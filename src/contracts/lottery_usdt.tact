import "@stdlib/deploy";

// Jetton Transfer Notification (from our own Jetton wallet to us)
message(0x7362d09c) JettonTransferNotification {
    amount: Int;           // token amount (smallest units)
    sender: Address;       // buyer's Jetton wallet address
    forwardPayload: Cell; // payload supplied by buyer (ticketId, optional owner)
}

// Admin / ops
message(0xa1ed4eaa) Prepare_rewards {}
message(0xa1ed4eab) Distribute_rewards {}
message (0xa1ed4eac) Ownership { newOwner: Address; }
message IncreaseTime { seconds: Int; }
message DecreaseTime { seconds: Int; }
message IncreaseTicket { ticket: Int; }
message DecreaseTicket { ticket: Int; }
message TicketId { ticket: Int; }
message SetTokenWallet { wallet: Address; }   // set/replace this contract's own jetton wallet (same token)
message SetTokenMaster { master: Address; }   // optional: store the token master for reference

const OP_JETTON_TRANSFER: Int = 0x0f8a7ea5; // wallet->transfer

struct Ticket_Owner {
    participent: Address;  // buyer's jetton wallet (or owner if you encode it)
    reward: Int;           // in token units
    hasClaimed: Bool;
}

contract LotteryDraw with Deployable {

    // ----- ownership
    owner: Address;

    // ----- token config
    bid: Int;                 // ticket price in token smallest units
    tokenMaster: Address?;    // optional reference
    tokenWallet: Address;     // THIS contract's jetton wallet for the permitted token

    // ----- state
    tickets: map<Int, Int>;               // orderIndex -> ticketId
    participents: map<Int, Ticket_Owner>; // ticketId -> data
    totalPool: Int;
    participantCount: Int;
    maxTicket: Int;

    // ----- reward math
    adminPercentage: Int;
    floorPercentage: Int;
    bonusPercentage: Int;
    decayFactorNumerator: Int;
    decayFactorDenominator: Int;
    fixedPointScale: Int;

    rewardsPrepared: Bool;
    rewardsDistributed: Bool;

    minPrize: Int;
    remainingPool: Int;
    bonusCount: Int;
    guaranteedWinPool: Int;
    decayWinnerSum: Int;
    remainingDecaySum: Int;

    // ----- timing
    startTime: Int;
    endTime: Int;

    // ---- init ----
    init(
        _bid: Int,
        _howLongHours: Int,
        _maxTicket: Int,
        _adminPct: Int,
        _floorPct: Int,
        _bonusPct: Int,
        _decayNum: Int,
        _decayDenom: Int,
        _tokenWallet: Address,
        _tokenMaster: Address?
    ) {
        self.owner = sender();

        self.bid = _bid;
        self.tokenWallet = _tokenWallet;   // your contract’s wallet for the chosen token
        self.tokenMaster = _tokenMaster;   // optional

        self.tickets = emptyMap();
        self.participents = emptyMap();
        self.totalPool = 0;
        self.participantCount = 0;
        self.maxTicket = _maxTicket;

        self.adminPercentage = _adminPct;
        self.floorPercentage = _floorPct;
        self.bonusPercentage = _bonusPct;
        self.decayFactorNumerator = _decayNum;
        self.decayFactorDenominator = _decayDenom;
        self.fixedPointScale = 1_000_000;

        self.rewardsPrepared = false;
        self.rewardsDistributed = false;

        self.minPrize = 0;
        self.remainingPool = 0;
        self.bonusCount = 0;
        self.guaranteedWinPool = 0;
        self.decayWinnerSum = 0;
        self.remainingDecaySum = 0;

        self.startTime = now();
        self.endTime = now() + _howLongHours * 60 * 60;
    }

    // ignore stray TON
    receive() {}

    // -------- BUY TICKET (strict) ----------
    // The ONLY accepted path is: buyer transfers token to YOUR wallet,
    // then your wallet notifies THIS contract with this message.
    receive(msg: JettonTransferNotification) {
        // STRICT TOKEN CHECK:
        // only accept notifications that come from OUR internal token wallet
        require(self.participantCount < self.maxTicket, "Tickets sold out");
        require(self.startTime <= now() && self.endTime >= now(), "Sales window closed");
        require(msg.amount > 0, "Zero token amount");
        require(sender() == self.tokenWallet, "Only internal token wallet");

        // parse ticketId (and optionally buyer owner) from payload
        let s = msg.forwardPayload.beginParse();
        require(s.bits() >= 32, "Missing ticketId");
        let ticketId = s.loadInt(32);
        require(self.participents.get(ticketId) == null, "Duplicate ticket");
        
        // amount
        require(msg.amount >= self.bid, "Insufficient token payment");
        // unique ticket
        
        // record
        self.participantCount += 1;
        self.tickets.set(self.participantCount, ticketId);

        // use msg.sender (buyer’s jetton wallet) as payout target
        self.participents.set(ticketId, Ticket_Owner{
            participent: msg.sender,
            reward: 0,
            hasClaimed: false
        });

        // account pool at exact bid (overpay stays in our wallet)
        self.totalPool += self.bid;

        // NOTE: We do NOT refund overpay here—keeps logic simple and secure.
        // If you want refunds, add sendToken(msg.sender, msg.amount - self.bid, null()) with bounds checks.
    }

    // -------- PREPARE REWARDS (admin) ----------
    receive(_: Prepare_rewards) {
        require(sender() == self.owner, "Only admin");
        require(!self.rewardsPrepared, "Already prepared");
        require(self.participantCount > 0, "No participants");

        let adminCut: Int = self.totalPool * self.adminPercentage / 100;
        let prizePool: Int = self.totalPool - adminCut;

        let totalMinPrize: Int = prizePool * self.floorPercentage / 100;
        self.remainingPool = prizePool - totalMinPrize;
        if (self.remainingPool < 0) {self.remainingPool = 0;}

        self.minPrize = totalMinPrize / self.participantCount;

        self.bonusCount = self.participantCount * self.bonusPercentage / 100;
        self.guaranteedWinPool = self.remainingPool / 2;

        // decay sums
        let i: Int = 1;
        let dw: Int = 0;
        while (i <= self.bonusCount) {
            dw += self.get_decay_weight(i);
            i += 1;
        }
        self.decayWinnerSum = dw;

        let rw: Int = 0;
        while (i <= self.participantCount) {
            rw += self.get_decay_weight(i);
            i += 1;
        }
        self.remainingDecaySum = rw;

        self.rewardsPrepared = true;
    }

    // -------- DISTRIBUTE (admin) ----------
    receive(_: Distribute_rewards) {
        require(sender() == self.owner, "Only admin");
        require(self.rewardsPrepared, "Prepare first");
        require(!self.rewardsDistributed, "Already distributed");

        // Fisher–Yates shuffle
        let salt: Int = 1;
        let i: Int = self.participantCount;
        while (i > 1) {
            let j: Int = 1 + self.random_uint(i, salt);
            salt += 1;

            let ti: Int? = self.tickets.get(i);
            let tj: Int? = self.tickets.get(j);
            self.tickets.set(i, tj);
            self.tickets.set(j, ti);

            i -= 1;
        }

        let guaranteedWinPool: Int = self.guaranteedWinPool;
        let remainingPool: Int = self.remainingPool - self.guaranteedWinPool;
        let minPrize: Int = self.minPrize;
        let dws: Int = (self.decayWinnerSum == 0 ? 1 : self.decayWinnerSum);
        let rws: Int = (self.remainingDecaySum == 0 ? 1 : self.remainingDecaySum);

        let k: Int = 1;
        while (k <= self.participantCount) {
            let weight: Int = self.get_decay_weight(k);
            let bonus: Int =
                (k <= self.bonusCount)
                    ? (guaranteedWinPool * weight) / dws
                    : (remainingPool  * weight) / rws;

            let totalReward: Int = minPrize + bonus;

            let tId: Int? = self.tickets.get(k);
            if (tId != null) {
                let to: Ticket_Owner = self.participents.get(tId!!)!!;
                self.participents.set(tId!!, Ticket_Owner{
                    participent: to.participent,
                    reward: totalReward,
                    hasClaimed: to.hasClaimed
                });
            }
            k += 1;
        }

        self.rewardsDistributed = true;
    }

    // -------- CLAIM ----------
    receive(tk: TicketId) {
        let info: Ticket_Owner? = self.participents.get(tk.ticket);
        require(info != null, "No such ticket");
        require(self.rewardsDistributed, "Not distributed yet");
        require(info!!.hasClaimed == false, "Already claimed");

        let amount: Int = info!!.reward;
        require(amount > 0, "No reward");

        // mark claimed
        self.participents.set(tk.ticket, Ticket_Owner{
            participent: info!!.participent,
            reward: 0,
            hasClaimed: true
        });

        // pay from our internal wallet
        self.sendToken(info!!.participent, amount, null);
    }

    // -------- Admin utils ----------
    receive(msg: IncreaseTime) { require(sender() == self.owner, "Only admin"); self.endTime += msg.seconds; }
    receive(msg: DecreaseTime) { require(sender() == self.owner, "Only admin"); require(self.endTime - msg.seconds >= self.startTime, "Before start"); self.endTime -= msg.seconds; }
    receive(msg: IncreaseTicket) { require(sender() == self.owner, "Only admin"); self.maxTicket += msg.ticket; }
    receive(msg: DecreaseTicket) { require(sender() == self.owner, "Only admin"); require(self.maxTicket - msg.ticket >= 0, "Below zero"); self.maxTicket -= msg.ticket; }
    receive(msg: Ownership) { require(sender() == self.owner, "Only current owner"); self.owner = msg.newOwner; }
    receive(msg: SetTokenWallet) { require(sender() == self.owner, "Only admin"); self.tokenWallet = msg.wallet; }
    receive(msg: SetTokenMaster) { require(sender() == self.owner, "Only admin"); self.tokenMaster = msg.master; }

    // -------- Token send via our internal wallet ----------
  inline fun sendToken(to: Address, amount: Int, payload: Cell?) {
        let fwd = (payload == null) ? beginCell().endCell() : payload!!;

        let body = beginCell()
            .storeUint(OP_JETTON_TRANSFER, 32)
            .storeUint(0, 64)             // query_id
            .storeCoins(amount)           // jetton amount
            .storeAddress(to)             // destination (recipient's jetton wallet)
            .storeBit(false)           // response_destination
            .storeCoins(0)                // forward_ton_amount
            .storeBit(false)              // no custom payload to wallet
            .storeRef(fwd)                // forward_payload
            .endCell();

        // Send to OUR wallet (it holds the tokens)
        send(SendParameters{
            to: self.tokenWallet,
            value: ton("0.05") ,              // TON for gas; adjust if needed
            body: body,
            mode: SendIgnoreErrors        // never SendRemainingBalance
        });
    }

    // -------- Helpers & getters ----------
    get fun random_uint(max: Int, salt: Int): Int {
        let data = beginCell().storeUint(now(), 64).storeUint(salt, 32).endCell().asSlice();
        let hashVal: Int = sha256(data);
        return (hashVal % max + max) % max; // [0..max-1]
    }

    get fun get_decay_weight(index: Int): Int {
        let num = pow(self.decayFactorNumerator, index);
        let den = pow(self.decayFactorDenominator, index);
        return num * self.fixedPointScale / den;
    }

    get fun get_participant_count(): Int { return self.participantCount; }
    get fun get_total_Pool(): Int { return self.totalPool; }
    get fun get_Ticket_Data(tk: Int): Ticket_Owner? { return self.participents.get(tk); }
    get fun get_Ticket_TotalData(): map<Int, Ticket_Owner> { return self.participents; }
    get fun get_Ticket_map(): map<Int, Int> { return self.tickets; }
    get fun get_BonusCount(): Int { return self.bonusCount; }
    get fun get_prize(index: Int): Int {
        return (self.guaranteedWinPool * self.get_decay_weight(index) / (self.decayWinnerSum == 0 ? 1 : self.decayWinnerSum));
    }
    get fun get_MinPrize(): Int { return self.minPrize; }
    
}
