"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotteryDraw = exports.LotteryDraw_getterMapping = exports.LotteryDraw_errors_backward = exports.LotteryDraw_errors = void 0;
exports.storeDataSize = storeDataSize;
exports.loadDataSize = loadDataSize;
exports.loadTupleDataSize = loadTupleDataSize;
exports.loadGetterTupleDataSize = loadGetterTupleDataSize;
exports.storeTupleDataSize = storeTupleDataSize;
exports.dictValueParserDataSize = dictValueParserDataSize;
exports.storeSignedBundle = storeSignedBundle;
exports.loadSignedBundle = loadSignedBundle;
exports.loadTupleSignedBundle = loadTupleSignedBundle;
exports.loadGetterTupleSignedBundle = loadGetterTupleSignedBundle;
exports.storeTupleSignedBundle = storeTupleSignedBundle;
exports.dictValueParserSignedBundle = dictValueParserSignedBundle;
exports.storeStateInit = storeStateInit;
exports.loadStateInit = loadStateInit;
exports.loadTupleStateInit = loadTupleStateInit;
exports.loadGetterTupleStateInit = loadGetterTupleStateInit;
exports.storeTupleStateInit = storeTupleStateInit;
exports.dictValueParserStateInit = dictValueParserStateInit;
exports.storeContext = storeContext;
exports.loadContext = loadContext;
exports.loadTupleContext = loadTupleContext;
exports.loadGetterTupleContext = loadGetterTupleContext;
exports.storeTupleContext = storeTupleContext;
exports.dictValueParserContext = dictValueParserContext;
exports.storeSendParameters = storeSendParameters;
exports.loadSendParameters = loadSendParameters;
exports.loadTupleSendParameters = loadTupleSendParameters;
exports.loadGetterTupleSendParameters = loadGetterTupleSendParameters;
exports.storeTupleSendParameters = storeTupleSendParameters;
exports.dictValueParserSendParameters = dictValueParserSendParameters;
exports.storeMessageParameters = storeMessageParameters;
exports.loadMessageParameters = loadMessageParameters;
exports.loadTupleMessageParameters = loadTupleMessageParameters;
exports.loadGetterTupleMessageParameters = loadGetterTupleMessageParameters;
exports.storeTupleMessageParameters = storeTupleMessageParameters;
exports.dictValueParserMessageParameters = dictValueParserMessageParameters;
exports.storeDeployParameters = storeDeployParameters;
exports.loadDeployParameters = loadDeployParameters;
exports.loadTupleDeployParameters = loadTupleDeployParameters;
exports.loadGetterTupleDeployParameters = loadGetterTupleDeployParameters;
exports.storeTupleDeployParameters = storeTupleDeployParameters;
exports.dictValueParserDeployParameters = dictValueParserDeployParameters;
exports.storeStdAddress = storeStdAddress;
exports.loadStdAddress = loadStdAddress;
exports.loadTupleStdAddress = loadTupleStdAddress;
exports.loadGetterTupleStdAddress = loadGetterTupleStdAddress;
exports.storeTupleStdAddress = storeTupleStdAddress;
exports.dictValueParserStdAddress = dictValueParserStdAddress;
exports.storeVarAddress = storeVarAddress;
exports.loadVarAddress = loadVarAddress;
exports.loadTupleVarAddress = loadTupleVarAddress;
exports.loadGetterTupleVarAddress = loadGetterTupleVarAddress;
exports.storeTupleVarAddress = storeTupleVarAddress;
exports.dictValueParserVarAddress = dictValueParserVarAddress;
exports.storeBasechainAddress = storeBasechainAddress;
exports.loadBasechainAddress = loadBasechainAddress;
exports.loadTupleBasechainAddress = loadTupleBasechainAddress;
exports.loadGetterTupleBasechainAddress = loadGetterTupleBasechainAddress;
exports.storeTupleBasechainAddress = storeTupleBasechainAddress;
exports.dictValueParserBasechainAddress = dictValueParserBasechainAddress;
exports.storeDeploy = storeDeploy;
exports.loadDeploy = loadDeploy;
exports.loadTupleDeploy = loadTupleDeploy;
exports.loadGetterTupleDeploy = loadGetterTupleDeploy;
exports.storeTupleDeploy = storeTupleDeploy;
exports.dictValueParserDeploy = dictValueParserDeploy;
exports.storeDeployOk = storeDeployOk;
exports.loadDeployOk = loadDeployOk;
exports.loadTupleDeployOk = loadTupleDeployOk;
exports.loadGetterTupleDeployOk = loadGetterTupleDeployOk;
exports.storeTupleDeployOk = storeTupleDeployOk;
exports.dictValueParserDeployOk = dictValueParserDeployOk;
exports.storeFactoryDeploy = storeFactoryDeploy;
exports.loadFactoryDeploy = loadFactoryDeploy;
exports.loadTupleFactoryDeploy = loadTupleFactoryDeploy;
exports.loadGetterTupleFactoryDeploy = loadGetterTupleFactoryDeploy;
exports.storeTupleFactoryDeploy = storeTupleFactoryDeploy;
exports.dictValueParserFactoryDeploy = dictValueParserFactoryDeploy;
exports.storeTicket_Owner = storeTicket_Owner;
exports.loadTicket_Owner = loadTicket_Owner;
exports.loadTupleTicket_Owner = loadTupleTicket_Owner;
exports.loadGetterTupleTicket_Owner = loadGetterTupleTicket_Owner;
exports.storeTupleTicket_Owner = storeTupleTicket_Owner;
exports.dictValueParserTicket_Owner = dictValueParserTicket_Owner;
exports.storeTicket = storeTicket;
exports.loadTicket = loadTicket;
exports.loadTupleTicket = loadTupleTicket;
exports.loadGetterTupleTicket = loadGetterTupleTicket;
exports.storeTupleTicket = storeTupleTicket;
exports.dictValueParserTicket = dictValueParserTicket;
exports.storeTickets = storeTickets;
exports.loadTickets = loadTickets;
exports.loadTupleTickets = loadTupleTickets;
exports.loadGetterTupleTickets = loadGetterTupleTickets;
exports.storeTupleTickets = storeTupleTickets;
exports.dictValueParserTickets = dictValueParserTickets;
exports.storeTicketId = storeTicketId;
exports.loadTicketId = loadTicketId;
exports.loadTupleTicketId = loadTupleTicketId;
exports.loadGetterTupleTicketId = loadGetterTupleTicketId;
exports.storeTupleTicketId = storeTupleTicketId;
exports.dictValueParserTicketId = dictValueParserTicketId;
exports.storeDecreaseTime = storeDecreaseTime;
exports.loadDecreaseTime = loadDecreaseTime;
exports.loadTupleDecreaseTime = loadTupleDecreaseTime;
exports.loadGetterTupleDecreaseTime = loadGetterTupleDecreaseTime;
exports.storeTupleDecreaseTime = storeTupleDecreaseTime;
exports.dictValueParserDecreaseTime = dictValueParserDecreaseTime;
exports.storeIncreaseTime = storeIncreaseTime;
exports.loadIncreaseTime = loadIncreaseTime;
exports.loadTupleIncreaseTime = loadTupleIncreaseTime;
exports.loadGetterTupleIncreaseTime = loadGetterTupleIncreaseTime;
exports.storeTupleIncreaseTime = storeTupleIncreaseTime;
exports.dictValueParserIncreaseTime = dictValueParserIncreaseTime;
exports.storeIncreaseTicket = storeIncreaseTicket;
exports.loadIncreaseTicket = loadIncreaseTicket;
exports.loadTupleIncreaseTicket = loadTupleIncreaseTicket;
exports.loadGetterTupleIncreaseTicket = loadGetterTupleIncreaseTicket;
exports.storeTupleIncreaseTicket = storeTupleIncreaseTicket;
exports.dictValueParserIncreaseTicket = dictValueParserIncreaseTicket;
exports.storeDecreaseTicket = storeDecreaseTicket;
exports.loadDecreaseTicket = loadDecreaseTicket;
exports.loadTupleDecreaseTicket = loadTupleDecreaseTicket;
exports.loadGetterTupleDecreaseTicket = loadGetterTupleDecreaseTicket;
exports.storeTupleDecreaseTicket = storeTupleDecreaseTicket;
exports.dictValueParserDecreaseTicket = dictValueParserDecreaseTicket;
exports.storePrepare_rewards = storePrepare_rewards;
exports.loadPrepare_rewards = loadPrepare_rewards;
exports.loadTuplePrepare_rewards = loadTuplePrepare_rewards;
exports.loadGetterTuplePrepare_rewards = loadGetterTuplePrepare_rewards;
exports.storeTuplePrepare_rewards = storeTuplePrepare_rewards;
exports.dictValueParserPrepare_rewards = dictValueParserPrepare_rewards;
exports.storeDistribute_rewards = storeDistribute_rewards;
exports.loadDistribute_rewards = loadDistribute_rewards;
exports.loadTupleDistribute_rewards = loadTupleDistribute_rewards;
exports.loadGetterTupleDistribute_rewards = loadGetterTupleDistribute_rewards;
exports.storeTupleDistribute_rewards = storeTupleDistribute_rewards;
exports.dictValueParserDistribute_rewards = dictValueParserDistribute_rewards;
exports.storeOwnership = storeOwnership;
exports.loadOwnership = loadOwnership;
exports.loadTupleOwnership = loadTupleOwnership;
exports.loadGetterTupleOwnership = loadGetterTupleOwnership;
exports.storeTupleOwnership = storeTupleOwnership;
exports.dictValueParserOwnership = dictValueParserOwnership;
exports.storeLotteryDraw$Data = storeLotteryDraw$Data;
exports.loadLotteryDraw$Data = loadLotteryDraw$Data;
exports.loadTupleLotteryDraw$Data = loadTupleLotteryDraw$Data;
exports.loadGetterTupleLotteryDraw$Data = loadGetterTupleLotteryDraw$Data;
exports.storeTupleLotteryDraw$Data = storeTupleLotteryDraw$Data;
exports.dictValueParserLotteryDraw$Data = dictValueParserLotteryDraw$Data;
const core_1 = require("@ton/core");
function storeDataSize(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}
function loadDataSize(slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function loadTupleDataSize(source) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function loadGetterTupleDataSize(source) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function storeTupleDataSize(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}
function dictValueParserDataSize() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    };
}
function storeSignedBundle(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}
function loadSignedBundle(slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function loadTupleSignedBundle(source) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function loadGetterTupleSignedBundle(source) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function storeTupleSignedBundle(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}
function dictValueParserSignedBundle() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    };
}
function storeStateInit(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
function loadStateInit(slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function loadTupleStateInit(source) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function loadGetterTupleStateInit(source) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeTupleStateInit(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserStateInit() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    };
}
function storeContext(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}
function loadContext(slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function loadTupleContext(source) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function loadGetterTupleContext(source) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function storeTupleContext(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}
function dictValueParserContext() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    };
}
function storeSendParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}
function loadSendParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function loadTupleSendParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function loadGetterTupleSendParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function storeTupleSendParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}
function dictValueParserSendParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    };
}
function storeMessageParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}
function loadMessageParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function loadTupleMessageParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function loadGetterTupleMessageParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function storeTupleMessageParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}
function dictValueParserMessageParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    };
}
function storeDeployParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}
function loadDeployParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function loadTupleDeployParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function loadGetterTupleDeployParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function storeTupleDeployParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}
function dictValueParserDeployParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    };
}
function storeStdAddress(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}
function loadStdAddress(slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function loadTupleStdAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function loadGetterTupleStdAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function storeTupleStdAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}
function dictValueParserStdAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    };
}
function storeVarAddress(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}
function loadVarAddress(slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function loadTupleVarAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function loadGetterTupleVarAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function storeTupleVarAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}
function dictValueParserVarAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    };
}
function storeBasechainAddress(src) {
    return (builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) {
            b_0.storeBit(true).storeInt(src.hash, 257);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
function loadBasechainAddress(slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress', hash: _hash };
}
function loadTupleBasechainAddress(source) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress', hash: _hash };
}
function loadGetterTupleBasechainAddress(source) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress', hash: _hash };
}
function storeTupleBasechainAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}
function dictValueParserBasechainAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    };
}
function storeDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
function loadTupleDeploy(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function loadGetterTupleDeploy(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function storeTupleDeploy(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeploy() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployOk(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeployOk(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
function loadTupleDeployOk(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function loadGetterTupleDeployOk(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function storeTupleDeployOk(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeployOk() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    };
}
function storeFactoryDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}
function loadFactoryDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function loadTupleFactoryDeploy(source) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function loadGetterTupleFactoryDeploy(source) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function storeTupleFactoryDeploy(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}
function dictValueParserFactoryDeploy() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    };
}
function storeTicket_Owner(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.participent);
        b_0.storeInt(src.reward, 257);
        b_0.storeBit(src.hasClaimed);
    };
}
function loadTicket_Owner(slice) {
    const sc_0 = slice;
    const _participent = sc_0.loadAddress();
    const _reward = sc_0.loadIntBig(257);
    const _hasClaimed = sc_0.loadBit();
    return { $$type: 'Ticket_Owner', participent: _participent, reward: _reward, hasClaimed: _hasClaimed };
}
function loadTupleTicket_Owner(source) {
    const _participent = source.readAddress();
    const _reward = source.readBigNumber();
    const _hasClaimed = source.readBoolean();
    return { $$type: 'Ticket_Owner', participent: _participent, reward: _reward, hasClaimed: _hasClaimed };
}
function loadGetterTupleTicket_Owner(source) {
    const _participent = source.readAddress();
    const _reward = source.readBigNumber();
    const _hasClaimed = source.readBoolean();
    return { $$type: 'Ticket_Owner', participent: _participent, reward: _reward, hasClaimed: _hasClaimed };
}
function storeTupleTicket_Owner(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeAddress(source.participent);
    builder.writeNumber(source.reward);
    builder.writeBoolean(source.hasClaimed);
    return builder.build();
}
function dictValueParserTicket_Owner() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeTicket_Owner(src)).endCell());
        },
        parse: (src) => {
            return loadTicket_Owner(src.loadRef().beginParse());
        }
    };
}
function storeTicket(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2553472917, 32);
        b_0.storeInt(src.ticketId, 257);
    };
}
function loadTicket(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2553472917) {
        throw Error('Invalid prefix');
    }
    const _ticketId = sc_0.loadIntBig(257);
    return { $$type: 'Ticket', ticketId: _ticketId };
}
function loadTupleTicket(source) {
    const _ticketId = source.readBigNumber();
    return { $$type: 'Ticket', ticketId: _ticketId };
}
function loadGetterTupleTicket(source) {
    const _ticketId = source.readBigNumber();
    return { $$type: 'Ticket', ticketId: _ticketId };
}
function storeTupleTicket(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.ticketId);
    return builder.build();
}
function dictValueParserTicket() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeTicket(src)).endCell());
        },
        parse: (src) => {
            return loadTicket(src.loadRef().beginParse());
        }
    };
}
function storeTickets(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3436563871, 32);
        b_0.storeDict(src.ticketIds, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
        b_0.storeInt(src.ticketcount, 257);
    };
}
function loadTickets(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3436563871) {
        throw Error('Invalid prefix');
    }
    const _ticketIds = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), sc_0);
    const _ticketcount = sc_0.loadIntBig(257);
    return { $$type: 'Tickets', ticketIds: _ticketIds, ticketcount: _ticketcount };
}
function loadTupleTickets(source) {
    const _ticketIds = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _ticketcount = source.readBigNumber();
    return { $$type: 'Tickets', ticketIds: _ticketIds, ticketcount: _ticketcount };
}
function loadGetterTupleTickets(source) {
    const _ticketIds = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _ticketcount = source.readBigNumber();
    return { $$type: 'Tickets', ticketIds: _ticketIds, ticketcount: _ticketcount };
}
function storeTupleTickets(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeCell(source.ticketIds.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.ticketIds, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.ticketcount);
    return builder.build();
}
function dictValueParserTickets() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeTickets(src)).endCell());
        },
        parse: (src) => {
            return loadTickets(src.loadRef().beginParse());
        }
    };
}
function storeTicketId(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1442497784, 32);
        b_0.storeInt(src.ticket, 257);
    };
}
function loadTicketId(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1442497784) {
        throw Error('Invalid prefix');
    }
    const _ticket = sc_0.loadIntBig(257);
    return { $$type: 'TicketId', ticket: _ticket };
}
function loadTupleTicketId(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'TicketId', ticket: _ticket };
}
function loadGetterTupleTicketId(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'TicketId', ticket: _ticket };
}
function storeTupleTicketId(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.ticket);
    return builder.build();
}
function dictValueParserTicketId() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeTicketId(src)).endCell());
        },
        parse: (src) => {
            return loadTicketId(src.loadRef().beginParse());
        }
    };
}
function storeDecreaseTime(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3151043122, 32);
        b_0.storeInt(src.seconds, 257);
    };
}
function loadDecreaseTime(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3151043122) {
        throw Error('Invalid prefix');
    }
    const _seconds = sc_0.loadIntBig(257);
    return { $$type: 'DecreaseTime', seconds: _seconds };
}
function loadTupleDecreaseTime(source) {
    const _seconds = source.readBigNumber();
    return { $$type: 'DecreaseTime', seconds: _seconds };
}
function loadGetterTupleDecreaseTime(source) {
    const _seconds = source.readBigNumber();
    return { $$type: 'DecreaseTime', seconds: _seconds };
}
function storeTupleDecreaseTime(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.seconds);
    return builder.build();
}
function dictValueParserDecreaseTime() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDecreaseTime(src)).endCell());
        },
        parse: (src) => {
            return loadDecreaseTime(src.loadRef().beginParse());
        }
    };
}
function storeIncreaseTime(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3976926516, 32);
        b_0.storeInt(src.seconds, 257);
    };
}
function loadIncreaseTime(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3976926516) {
        throw Error('Invalid prefix');
    }
    const _seconds = sc_0.loadIntBig(257);
    return { $$type: 'IncreaseTime', seconds: _seconds };
}
function loadTupleIncreaseTime(source) {
    const _seconds = source.readBigNumber();
    return { $$type: 'IncreaseTime', seconds: _seconds };
}
function loadGetterTupleIncreaseTime(source) {
    const _seconds = source.readBigNumber();
    return { $$type: 'IncreaseTime', seconds: _seconds };
}
function storeTupleIncreaseTime(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.seconds);
    return builder.build();
}
function dictValueParserIncreaseTime() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeIncreaseTime(src)).endCell());
        },
        parse: (src) => {
            return loadIncreaseTime(src.loadRef().beginParse());
        }
    };
}
function storeIncreaseTicket(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3276149870, 32);
        b_0.storeInt(src.ticket, 257);
    };
}
function loadIncreaseTicket(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3276149870) {
        throw Error('Invalid prefix');
    }
    const _ticket = sc_0.loadIntBig(257);
    return { $$type: 'IncreaseTicket', ticket: _ticket };
}
function loadTupleIncreaseTicket(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'IncreaseTicket', ticket: _ticket };
}
function loadGetterTupleIncreaseTicket(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'IncreaseTicket', ticket: _ticket };
}
function storeTupleIncreaseTicket(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.ticket);
    return builder.build();
}
function dictValueParserIncreaseTicket() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeIncreaseTicket(src)).endCell());
        },
        parse: (src) => {
            return loadIncreaseTicket(src.loadRef().beginParse());
        }
    };
}
function storeDecreaseTicket(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3840286441, 32);
        b_0.storeInt(src.ticket, 257);
    };
}
function loadDecreaseTicket(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3840286441) {
        throw Error('Invalid prefix');
    }
    const _ticket = sc_0.loadIntBig(257);
    return { $$type: 'DecreaseTicket', ticket: _ticket };
}
function loadTupleDecreaseTicket(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'DecreaseTicket', ticket: _ticket };
}
function loadGetterTupleDecreaseTicket(source) {
    const _ticket = source.readBigNumber();
    return { $$type: 'DecreaseTicket', ticket: _ticket };
}
function storeTupleDecreaseTicket(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.ticket);
    return builder.build();
}
function dictValueParserDecreaseTicket() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDecreaseTicket(src)).endCell());
        },
        parse: (src) => {
            return loadDecreaseTicket(src.loadRef().beginParse());
        }
    };
}
function storePrepare_rewards(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2716683946, 32);
    };
}
function loadPrepare_rewards(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2716683946) {
        throw Error('Invalid prefix');
    }
    return { $$type: 'Prepare_rewards' };
}
function loadTuplePrepare_rewards(source) {
    return { $$type: 'Prepare_rewards' };
}
function loadGetterTuplePrepare_rewards(source) {
    return { $$type: 'Prepare_rewards' };
}
function storeTuplePrepare_rewards(source) {
    const builder = new core_1.TupleBuilder();
    return builder.build();
}
function dictValueParserPrepare_rewards() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storePrepare_rewards(src)).endCell());
        },
        parse: (src) => {
            return loadPrepare_rewards(src.loadRef().beginParse());
        }
    };
}
function storeDistribute_rewards(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2716683947, 32);
    };
}
function loadDistribute_rewards(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2716683947) {
        throw Error('Invalid prefix');
    }
    return { $$type: 'Distribute_rewards' };
}
function loadTupleDistribute_rewards(source) {
    return { $$type: 'Distribute_rewards' };
}
function loadGetterTupleDistribute_rewards(source) {
    return { $$type: 'Distribute_rewards' };
}
function storeTupleDistribute_rewards(source) {
    const builder = new core_1.TupleBuilder();
    return builder.build();
}
function dictValueParserDistribute_rewards() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDistribute_rewards(src)).endCell());
        },
        parse: (src) => {
            return loadDistribute_rewards(src.loadRef().beginParse());
        }
    };
}
function storeOwnership(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2716683948, 32);
        b_0.storeStringRefTail(src.name);
    };
}
function loadOwnership(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2716683948) {
        throw Error('Invalid prefix');
    }
    const _name = sc_0.loadStringRefTail();
    return { $$type: 'Ownership', name: _name };
}
function loadTupleOwnership(source) {
    const _name = source.readString();
    return { $$type: 'Ownership', name: _name };
}
function loadGetterTupleOwnership(source) {
    const _name = source.readString();
    return { $$type: 'Ownership', name: _name };
}
function storeTupleOwnership(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.name);
    return builder.build();
}
function dictValueParserOwnership() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeOwnership(src)).endCell());
        },
        parse: (src) => {
            return loadOwnership(src.loadRef().beginParse());
        }
    };
}
function storeLotteryDraw$Data(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.bid, 257);
        b_0.storeInt(src.adminPercentage, 257);
        const b_1 = new core_1.Builder();
        b_1.storeInt(src.floorPercentage, 257);
        b_1.storeInt(src.bonusPercentage, 257);
        b_1.storeInt(src.decayFactorNumerator, 257);
        const b_2 = new core_1.Builder();
        b_2.storeInt(src.decayFactorDenominator, 257);
        b_2.storeInt(src.fixedPointScale, 257);
        b_2.storeAddress(src.admin);
        b_2.storeDict(src.tickets, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
        b_2.storeDict(src.participents, core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner());
        const b_3 = new core_1.Builder();
        b_3.storeInt(src.totalPool, 257);
        b_3.storeInt(src.participantCount, 257);
        b_3.storeBit(src.rewardsPrepared);
        b_3.storeBit(src.rewardsDistributed);
        b_3.storeInt(src.minPrize, 257);
        const b_4 = new core_1.Builder();
        b_4.storeInt(src.remainingPool, 257);
        b_4.storeInt(src.bonusCount, 257);
        b_4.storeInt(src.guaranteedWinPool, 257);
        const b_5 = new core_1.Builder();
        b_5.storeInt(src.decayWinnerSum, 257);
        b_5.storeInt(src.remainingDecaySum, 257);
        b_5.storeInt(src.startTime, 257);
        const b_6 = new core_1.Builder();
        b_6.storeInt(src.endTime, 257);
        b_6.storeInt(src.maxTicket, 257);
        b_5.storeRef(b_6.endCell());
        b_4.storeRef(b_5.endCell());
        b_3.storeRef(b_4.endCell());
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
function loadLotteryDraw$Data(slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _bid = sc_0.loadIntBig(257);
    const _adminPercentage = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _floorPercentage = sc_1.loadIntBig(257);
    const _bonusPercentage = sc_1.loadIntBig(257);
    const _decayFactorNumerator = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _decayFactorDenominator = sc_2.loadIntBig(257);
    const _fixedPointScale = sc_2.loadIntBig(257);
    const _admin = sc_2.loadMaybeAddress();
    const _tickets = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), sc_2);
    const _participents = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner(), sc_2);
    const sc_3 = sc_2.loadRef().beginParse();
    const _totalPool = sc_3.loadIntBig(257);
    const _participantCount = sc_3.loadIntBig(257);
    const _rewardsPrepared = sc_3.loadBit();
    const _rewardsDistributed = sc_3.loadBit();
    const _minPrize = sc_3.loadIntBig(257);
    const sc_4 = sc_3.loadRef().beginParse();
    const _remainingPool = sc_4.loadIntBig(257);
    const _bonusCount = sc_4.loadIntBig(257);
    const _guaranteedWinPool = sc_4.loadIntBig(257);
    const sc_5 = sc_4.loadRef().beginParse();
    const _decayWinnerSum = sc_5.loadIntBig(257);
    const _remainingDecaySum = sc_5.loadIntBig(257);
    const _startTime = sc_5.loadIntBig(257);
    const sc_6 = sc_5.loadRef().beginParse();
    const _endTime = sc_6.loadIntBig(257);
    const _maxTicket = sc_6.loadIntBig(257);
    return { $$type: 'LotteryDraw$Data', owner: _owner, bid: _bid, adminPercentage: _adminPercentage, floorPercentage: _floorPercentage, bonusPercentage: _bonusPercentage, decayFactorNumerator: _decayFactorNumerator, decayFactorDenominator: _decayFactorDenominator, fixedPointScale: _fixedPointScale, admin: _admin, tickets: _tickets, participents: _participents, totalPool: _totalPool, participantCount: _participantCount, rewardsPrepared: _rewardsPrepared, rewardsDistributed: _rewardsDistributed, minPrize: _minPrize, remainingPool: _remainingPool, bonusCount: _bonusCount, guaranteedWinPool: _guaranteedWinPool, decayWinnerSum: _decayWinnerSum, remainingDecaySum: _remainingDecaySum, startTime: _startTime, endTime: _endTime, maxTicket: _maxTicket };
}
function loadTupleLotteryDraw$Data(source) {
    const _owner = source.readAddress();
    const _bid = source.readBigNumber();
    const _adminPercentage = source.readBigNumber();
    const _floorPercentage = source.readBigNumber();
    const _bonusPercentage = source.readBigNumber();
    const _decayFactorNumerator = source.readBigNumber();
    const _decayFactorDenominator = source.readBigNumber();
    const _fixedPointScale = source.readBigNumber();
    const _admin = source.readAddressOpt();
    const _tickets = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _participents = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner(), source.readCellOpt());
    const _totalPool = source.readBigNumber();
    const _participantCount = source.readBigNumber();
    const _rewardsPrepared = source.readBoolean();
    source = source.readTuple();
    const _rewardsDistributed = source.readBoolean();
    const _minPrize = source.readBigNumber();
    const _remainingPool = source.readBigNumber();
    const _bonusCount = source.readBigNumber();
    const _guaranteedWinPool = source.readBigNumber();
    const _decayWinnerSum = source.readBigNumber();
    const _remainingDecaySum = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _maxTicket = source.readBigNumber();
    return { $$type: 'LotteryDraw$Data', owner: _owner, bid: _bid, adminPercentage: _adminPercentage, floorPercentage: _floorPercentage, bonusPercentage: _bonusPercentage, decayFactorNumerator: _decayFactorNumerator, decayFactorDenominator: _decayFactorDenominator, fixedPointScale: _fixedPointScale, admin: _admin, tickets: _tickets, participents: _participents, totalPool: _totalPool, participantCount: _participantCount, rewardsPrepared: _rewardsPrepared, rewardsDistributed: _rewardsDistributed, minPrize: _minPrize, remainingPool: _remainingPool, bonusCount: _bonusCount, guaranteedWinPool: _guaranteedWinPool, decayWinnerSum: _decayWinnerSum, remainingDecaySum: _remainingDecaySum, startTime: _startTime, endTime: _endTime, maxTicket: _maxTicket };
}
function loadGetterTupleLotteryDraw$Data(source) {
    const _owner = source.readAddress();
    const _bid = source.readBigNumber();
    const _adminPercentage = source.readBigNumber();
    const _floorPercentage = source.readBigNumber();
    const _bonusPercentage = source.readBigNumber();
    const _decayFactorNumerator = source.readBigNumber();
    const _decayFactorDenominator = source.readBigNumber();
    const _fixedPointScale = source.readBigNumber();
    const _admin = source.readAddressOpt();
    const _tickets = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _participents = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner(), source.readCellOpt());
    const _totalPool = source.readBigNumber();
    const _participantCount = source.readBigNumber();
    const _rewardsPrepared = source.readBoolean();
    const _rewardsDistributed = source.readBoolean();
    const _minPrize = source.readBigNumber();
    const _remainingPool = source.readBigNumber();
    const _bonusCount = source.readBigNumber();
    const _guaranteedWinPool = source.readBigNumber();
    const _decayWinnerSum = source.readBigNumber();
    const _remainingDecaySum = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    const _maxTicket = source.readBigNumber();
    return { $$type: 'LotteryDraw$Data', owner: _owner, bid: _bid, adminPercentage: _adminPercentage, floorPercentage: _floorPercentage, bonusPercentage: _bonusPercentage, decayFactorNumerator: _decayFactorNumerator, decayFactorDenominator: _decayFactorDenominator, fixedPointScale: _fixedPointScale, admin: _admin, tickets: _tickets, participents: _participents, totalPool: _totalPool, participantCount: _participantCount, rewardsPrepared: _rewardsPrepared, rewardsDistributed: _rewardsDistributed, minPrize: _minPrize, remainingPool: _remainingPool, bonusCount: _bonusCount, guaranteedWinPool: _guaranteedWinPool, decayWinnerSum: _decayWinnerSum, remainingDecaySum: _remainingDecaySum, startTime: _startTime, endTime: _endTime, maxTicket: _maxTicket };
}
function storeTupleLotteryDraw$Data(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.bid);
    builder.writeNumber(source.adminPercentage);
    builder.writeNumber(source.floorPercentage);
    builder.writeNumber(source.bonusPercentage);
    builder.writeNumber(source.decayFactorNumerator);
    builder.writeNumber(source.decayFactorDenominator);
    builder.writeNumber(source.fixedPointScale);
    builder.writeAddress(source.admin);
    builder.writeCell(source.tickets.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.tickets, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.participents.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.participents, core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner()).endCell() : null);
    builder.writeNumber(source.totalPool);
    builder.writeNumber(source.participantCount);
    builder.writeBoolean(source.rewardsPrepared);
    builder.writeBoolean(source.rewardsDistributed);
    builder.writeNumber(source.minPrize);
    builder.writeNumber(source.remainingPool);
    builder.writeNumber(source.bonusCount);
    builder.writeNumber(source.guaranteedWinPool);
    builder.writeNumber(source.decayWinnerSum);
    builder.writeNumber(source.remainingDecaySum);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    builder.writeNumber(source.maxTicket);
    return builder.build();
}
function dictValueParserLotteryDraw$Data() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeLotteryDraw$Data(src)).endCell());
        },
        parse: (src) => {
            return loadLotteryDraw$Data(src.loadRef().beginParse());
        }
    };
}
function initLotteryDraw_init_args(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src._adminPct, 257);
        b_0.storeInt(src._floorPct, 257);
        b_0.storeInt(src._bonusPct, 257);
        const b_1 = new core_1.Builder();
        b_1.storeInt(src._decayNum, 257);
        b_1.storeInt(src._decayDenom, 257);
        b_1.storeInt(src._Bid, 257);
        const b_2 = new core_1.Builder();
        b_2.storeInt(src._HowLong, 257);
        b_2.storeInt(src._MaxTicket, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
async function LotteryDraw_init(_adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket) {
    const __code = core_1.Cell.fromHex('b5ee9c72410254010018dc00025aff008e88f4a413f4bcf2c80bed53208e983001d072d721d200d200fa4021103450666f04f86102f862e1ed43d9012702027102160201200313020120040e020158050c020120060a03f4a848ed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e2282a07017c1117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f6c810802ec261118111911181117111911171116111911161115111911151114111911141113111911131112111911121111111911111110111911100f11190f0e11190e0d11190d0c11190c0b11190b0a11190a0911190911190807065540db3c01111901a824a904111711181117111611171116111511161115400900781114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610451034413004f8a80fed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e2db3c282a0b2600022c04f9ae02f6a268690000c75a6d9e2b8c088b088b888b088a888b088a888a088a888a0889888a088988890889888908888889088888880888888807888807aa87475cc08080eb80408080eb80408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb8018082c082b882b0468aa83716d9e40282a0d260002260201480f1103f5af2676a268690000c75a6d9e2b8c088b088b888b088a888b088a888a088a888a0889888a088988890889888908888889088888880888888807888807aa87475cc08080eb80408080eb80408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb8018082c082b882b0468aa837140282a10017c1117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f6c814004f9ae5476a268690000c75a6d9e2b8c088b088b888b088a888b088a888a088a888a0889888a088988890889888908888889088888880888888807888807aa87475cc08080eb80408080eb80408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb8018082c082b882b0468aa83716d9e40282a122600022b04f9bad4fed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e2db3c8282a1426019456167920c101f2d08620c24df2d086c85921c1009758cf84b658a358de712192a70ae412a90c50338e139a7aa90ca630541220c000e63068a592cb07e4da215820c0009230318ae2c9d015007a700196207aa908c000967aa90401a401e88e18c8019a7aa90ca630541220c000e63068a520599312cb07e4da1259a013a101cf84ba0193cf84c2e4cf1302014817240201201822020120191c03f5adb5f6a268690000c75a6d9e2b8c088b088b888b088a888b088a888a088a888a0889888a088988890889888908888889088888880888888807888807aa87475cc08080eb80408080eb80408080eb806a00e8408080eb80408080eb80408080eb806a1868408080eb80408080eb8018082c082b882b0468aa837140282a1a01841117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c57105f0f6c811b01c2c8f82301cb3fcb1fc9d09b9320d74a91d5e868f90400da118bd64756d70286861736856616c29852108d0ad19a5b19481cdc98cbd8dbdb9d1c9858dd1ccbdb1bdd1d195c9e57d91c985dcb9d1858dd0e8c8e0e0e8e4ea0db3c21a90821a001a908350201201d2003f4abcbed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e2282a1e01a81117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f6c81206e92306d99206ef2d0806f236f03e2206e92306dde1f004c8101012f0259f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e204f8a8a0ed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e2db3c282a212600022d04f9b23f7b513434800063ad36cf15c604458445c4458445444584454445044544450444c4450444c4448444c44484444444844444440444444403c44403d543a3ae60404075c020404075c020404075c035007420404075c020404075c020404075c0350c3420404075c020404075c00c04160415c41582345541b8b6cf20282a232600022e04f9b72a1da89a1a400031d69b678ae30222c222e222c222a222c222a2228222a22282226222822262224222622242222222422222220222222201e22201eaa1d1d73020203ae01020203ae01020203ae01a803a1020203ae01020203ae01020203ae01a861a1020203ae01020203ae006020b020ae20ac11a2aa0dc5b6790282a2526000228000c57105f0f6c8104feed44d0d200018eb4db3c57181116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e8eb9810101d700810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d7003010581057105608d15506e21119e302705618282a2b2c01f4fa40810101d700810101d700d401d0810101d700810101d700810101d700d430d0810101d700810101d700d72c01916d93fa4001e201f404f404d430d0810101d700810101d700d200d200810101d700d430d0810101d700810101d700810101d700d430d0810101d700810101d700810101d700d430d0810101290034d700810101d7003011151118111511151117111511151116111500b46d6df84282080f4240f84270207054711154700070f823f8231112a73ca73c01111201a00d11170d1112111611120d11150d1112111411120d11130d0d11110d0c11100c10bf10be10bd10ac109b108a1910781067104641050400085f0f5f0a0468d74920c21f97311118d31f1119de2182109832e795bae302218210ccd5cd9fbae302218210a1ed4eaabae302218210a1ed4eabba2d31393b01fc5b1117810101d700308200f8732b561ab9f2f482009068f8416f24135f03561701bbf2f48200a735f8235230bb96f823561901be9170e2f2f48200913d2ab3f2f42081592e2e8101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26ef2f40ba481010120031110035412011111012e02fe216e955b59f45a3098c801cf004133f442e2810101f8427070c855205023ce810101cf00ca00c9103e41c0206e953059f45a30944133f415e2f8416f24135f035615a10b5615a02bc200913be30d1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df109e0d2f300078f842500c726d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00016010ac10ab108a107910681057104610354430c87f01ca0011181117111611151114111311121111111055e0db3cc9ed545204d45b1117f404810101d70030208200be3821c200f2f4561721a88d05191d5b5c0a1c995c5d5a5c9959105b5bdd5b9d0a608d0b119a5b19481cdc98cbd8dbdb9d1c9858dd1ccbdb1bdd1d195c9e57d91c985dcb9d1858dd0e8c4c8c8e8c4c0ea0db3cf8416f24135f03898935323334002a64756d7028636f6e7465787428292e76616c756529005846696c65207372632f636f6e7472616374732f6c6f74746572795f647261772e746163743a3132333a31303a04f2db3c8200a735f8235250bb96f823561b01be9170e2f2f48200f87353d1a0561cbbf2f48200913d2cb3f2f470935301b98ae810235f03f8416f24135f03561658a8a120c2009130e30d1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551c3536384e0094226e8e108b46e756c6c833fe1430fe1430fe14308e33028e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d002fe1430fe1430fe1430e201fa81010121a4531555204133f40c6fa19401d70030925b6de2206ef2d0808200c07721c200f2f481592e56118101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26ef2f40ea48101012002111302561301561101216e955b59f45a3098c801cf004133f442e2810101f8427070c837005855205023ce810101cf00ca00c9031112031201111001206e953059f45a30944133f415e20e5618a00fa45e2d0076f84201726d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002fe5b6c44571381404df8425613c705f2f48200c1fa25b3f2f4820098a626c200f2f4536fa88064a9045270a1530fa88064a90466a15117a90421c100927032de537fa88064a90422ab007071935303bb8eac5e341036102510230111180111195619db3c01111901a01119a411181119111801111801104810375e321023e838403a02de7093538bbb8ea55e341036454010230111180111195618db3c01111a01a01118a4011118010810375e324344e83737381114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a7f0a1079102810374506441403404e04f68ff75b571781404df8425617c705f2f48200dd5028b3f2f4812a5729f2f4712a9320c2008ae85b547353a17154754993533fbb8ae85f06371114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10797f091068105710461035443012e0213c3d4e4300fe20a45220f8446e97f825f8157ff864de21a1f811a08101012056115422434133f40c6fa19401d70030925b6de2810101530056135422534133f40c6fa19401d70030925b6de221031113032559216e955b59f45a3098c801cf004133f442e28101015413221201111201216e955b59f45a3098c801cf004133f442e251e0a104fc533abbe30f561e01a081010120561159561f014133f40c6fa19401d70030925b6de2206eb3915be30d111ba4111b111d111b01111c011117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c3e3f414201fc23a51118111c11181117111b11171116111a11161115111911151114111c11141113111b11131112111a11121111111911111110111c11100f111b0f0e111a0e0d11190d0c111c0c0b111b0b0a111a0a0911190908111c0807111b0706111a060511190504111c0403111b0302111d0201111e01db3c561a01a8561ba9044001fc23a51118111c11181117111b11171116111a11161115111911151114111c11141113111b11131112111a11121111111911111110111c11100f111b0f0e111a0e0d11190d0c111c0c0b111b0b0a111a0a0911190908111c0807111b0706111a060511190504111c0403111b0302111d0201111e01db3c561901a8561da90440004a56132120c2fff28571019221a8e43156135820c2fff28571019221a8e431015612a801a90400c481010121206ef2d08056115959f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e2206ef2d0806f233181010103206ef2d0805044c855205023ce810101cf00ca00c90311100312206e953059f45a30944133f415e20d0018107b106a1059104810374613044a821055fac4f8bae302218210ed0b1534bae302218210bbd11a32bae302218210a1ed4eacba44494a4b01ee5b1117810101d700308126f32d8101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26eb3f2f48129f229f2f4815f022d8101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e2206ef2d0806f236c21c000f2f42c810101224501f459f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e2206ef2d0806f2330318200e87b216eb3f2f42d8101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e2206ef2d0806f235b7f708101014313c855205023ce810101cf00ca00c9103f41f04602fa206e953059f45a30944133f415e22c6eb38ec3f8420d206ef2d08088102e706d50426d50427fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00913ce2111511171115111411161114111311151113111211141112111111131111111011121110474800200000000048656c6c6f2c20576f726c6401540f11110f0e11100e10df551cc87f01ca0011181117111611151114111311121111111055e0db3cc9ed545201f65b1117810101d70030813e0af8425618c705f2f401111701a01115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354403c87f01ca0011181117111611151114111311121111111055e0db3cc9ed545201d05b1117810101d70030816633f8425618c705f2f48167cb561822a123bef2f401111701a11115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544034e02fe8ef45b57178164e2f842011117c70501111601f2f4f84211171114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035443012c87f01ca0011181117111611151114111311121111111055e0db3cc9ed54e0218210c346146eba524c02fe8efc5b1117810101d70030811983f8425618c705f2f401111801a01115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035443012c87f01ca0011181117111611151114111311121111111055e0db3cc9ed54e0524d03fe218210e4e61ee9ba8eea5b1117810101d700308200bf55f8425618c705f2f4814ce4561922a1c2fff2f401111801a11115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035443012e0218210946a98b6bae3024e4f51013cc87f01ca0011181117111611151114111311121111111055e0db3cc9ed545201be5b1117d33f30c8018210aff90f5758cb1fcb3fc91116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035443012500182f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0011181117111611151114111311121111111055e0db3cc9ed545201ca5719c0001118c12101111801b08ece1115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cc87f01ca0011181117111611151114111311121111111055e0db3cc9ed54e05f0f5f09f2c0825201f6011117011118ce01111501810101cf0001111301810101cf001111c8810101cf0001111001810101cf001e810101cf000cc8810101cf001b810101cf005009206e9430cf84809201cee217f40015f40003c8810101cf0012810101cf00ca0012ca0012810101cf0002c8810101cf0013810101cf0014810101cf0053005604c8810101cf0016810101cf0016810101cf0006c8810101cf0017810101cf0015cd14cd14cd13cd12cdcdef967639');
    const builder = (0, core_1.beginCell)();
    builder.storeUint(0, 1);
    initLotteryDraw_init_args({ $$type: 'LotteryDraw_init_args', _adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
exports.LotteryDraw_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    6531: { message: "Only admin can increase ticket count" },
    9971: { message: "Sorry!This Ticket has not participated in draw!" },
    10738: { message: "Reward Not Distributed Yet. wait for draw!!" },
    10839: { message: "first prepared reward then distribute reward" },
    15882: { message: "Only admin can increase time" },
    16461: { message: "Only admin" },
    19684: { message: "Cannot decrease ticket count below zero" },
    22830: { message: "Duplicate ticket not allowed" },
    24322: { message: "You have already claimed your reward!" },
    25826: { message: "Only current owner can transfer ownership" },
    26163: { message: "Only admin can decrease time" },
    26571: { message: "Cannot decrease time beyond start time" },
    36968: { message: "Amount is not enough for buying...." },
    37181: { message: "Rewards already prepared" },
    39078: { message: "No participants" },
    42805: { message: "Sorry! We have finished selling tickets..." },
    48696: { message: "No tickets provided" },
    48981: { message: "Only admin can decrease ticket count" },
    49271: { message: "Invalid ticket ID" },
    49658: { message: "Already prepared" },
    56656: { message: "Reward Already Distributed" },
    59515: { message: "you have not participated in draw!!" },
    63603: { message: "Sorry! we have ran out of tickets.." },
};
exports.LotteryDraw_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Only admin can increase ticket count": 6531,
    "Sorry!This Ticket has not participated in draw!": 9971,
    "Reward Not Distributed Yet. wait for draw!!": 10738,
    "first prepared reward then distribute reward": 10839,
    "Only admin can increase time": 15882,
    "Only admin": 16461,
    "Cannot decrease ticket count below zero": 19684,
    "Duplicate ticket not allowed": 22830,
    "You have already claimed your reward!": 24322,
    "Only current owner can transfer ownership": 25826,
    "Only admin can decrease time": 26163,
    "Cannot decrease time beyond start time": 26571,
    "Amount is not enough for buying....": 36968,
    "Rewards already prepared": 37181,
    "No participants": 39078,
    "Sorry! We have finished selling tickets...": 42805,
    "No tickets provided": 48696,
    "Only admin can decrease ticket count": 48981,
    "Invalid ticket ID": 49271,
    "Already prepared": 49658,
    "Reward Already Distributed": 56656,
    "you have not participated in draw!!": 59515,
    "Sorry! we have ran out of tickets..": 63603,
};
const LotteryDraw_types = [
    { "name": "DataSize", "header": null, "fields": [{ "name": "cells", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bits", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "refs", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "SignedBundle", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "fixed-bytes", "optional": false, "format": 64 } }, { "name": "signedData", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounceable", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "MessageParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "DeployParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "init", "type": { "kind": "simple", "type": "StateInit", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "BasechainAddress", "header": null, "fields": [{ "name": "hash", "type": { "kind": "simple", "type": "int", "optional": true, "format": 257 } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "Ticket_Owner", "header": null, "fields": [{ "name": "participent", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "reward", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "hasClaimed", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "Ticket", "header": 2553472917, "fields": [{ "name": "ticketId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "Tickets", "header": 3436563871, "fields": [{ "name": "ticketIds", "type": { "kind": "dict", "key": "int", "value": "int" } }, { "name": "ticketcount", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "TicketId", "header": 1442497784, "fields": [{ "name": "ticket", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "DecreaseTime", "header": 3151043122, "fields": [{ "name": "seconds", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "IncreaseTime", "header": 3976926516, "fields": [{ "name": "seconds", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "IncreaseTicket", "header": 3276149870, "fields": [{ "name": "ticket", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "DecreaseTicket", "header": 3840286441, "fields": [{ "name": "ticket", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "Prepare_rewards", "header": 2716683946, "fields": [] },
    { "name": "Distribute_rewards", "header": 2716683947, "fields": [] },
    { "name": "Ownership", "header": 2716683948, "fields": [{ "name": "name", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "LotteryDraw$Data", "header": null, "fields": [{ "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bid", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "adminPercentage", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "floorPercentage", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bonusPercentage", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "decayFactorNumerator", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "decayFactorDenominator", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "fixedPointScale", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "admin", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "tickets", "type": { "kind": "dict", "key": "int", "value": "int" } }, { "name": "participents", "type": { "kind": "dict", "key": "int", "value": "Ticket_Owner", "valueFormat": "ref" } }, { "name": "totalPool", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "participantCount", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "rewardsPrepared", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "rewardsDistributed", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "minPrize", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "remainingPool", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bonusCount", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "guaranteedWinPool", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "decayWinnerSum", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "remainingDecaySum", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "startTime", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "endTime", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "maxTicket", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
];
const LotteryDraw_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "Ticket": 2553472917,
    "Tickets": 3436563871,
    "TicketId": 1442497784,
    "DecreaseTime": 3151043122,
    "IncreaseTime": 3976926516,
    "IncreaseTicket": 3276149870,
    "DecreaseTicket": 3840286441,
    "Prepare_rewards": 2716683946,
    "Distribute_rewards": 2716683947,
    "Ownership": 2716683948,
};
const LotteryDraw_getters = [
    { "name": "random_uint", "methodId": 99179, "arguments": [{ "name": "max", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "salt", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_decay_weight", "methodId": 75340, "arguments": [{ "name": "index", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_participant_count", "methodId": 76968, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_total_Pool", "methodId": 70671, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_Ticket_Data", "methodId": 101323, "arguments": [{ "name": "tk", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "Ticket_Owner", "optional": true } },
    { "name": "get_Ticket_TotalData", "methodId": 101536, "arguments": [], "returnType": { "kind": "dict", "key": "int", "value": "Ticket_Owner", "valueFormat": "ref" } },
    { "name": "get_Ticket_map", "methodId": 104701, "arguments": [], "returnType": { "kind": "dict", "key": "int", "value": "int" } },
    { "name": "get_BonusCount", "methodId": 72709, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_prize", "methodId": 69704, "arguments": [{ "name": "index", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_MinPrize", "methodId": 112976, "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "get_Bid", "methodId": 93519, "arguments": [], "returnType": { "kind": "simple", "type": "string", "optional": false } },
];
exports.LotteryDraw_getterMapping = {
    'random_uint': 'getRandomUint',
    'get_decay_weight': 'getGetDecayWeight',
    'get_participant_count': 'getGetParticipantCount',
    'get_total_Pool': 'getGetTotalPool',
    'get_Ticket_Data': 'getGetTicketData',
    'get_Ticket_TotalData': 'getGetTicketTotalData',
    'get_Ticket_map': 'getGetTicketMap',
    'get_BonusCount': 'getGetBonusCount',
    'get_prize': 'getGetPrize',
    'get_MinPrize': 'getGetMinPrize',
    'get_Bid': 'getGetBid',
};
const LotteryDraw_receivers = [
    { "receiver": "internal", "message": { "kind": "empty" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Ticket" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Tickets" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Prepare_rewards" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Distribute_rewards" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "TicketId" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "IncreaseTime" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "DecreaseTime" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Ownership" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "IncreaseTicket" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "DecreaseTicket" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
];
class LotteryDraw {
    static async init(_adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket) {
        return await LotteryDraw_init(_adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket);
    }
    static async fromInit(_adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket) {
        const __gen_init = await LotteryDraw_init(_adminPct, _floorPct, _bonusPct, _decayNum, _decayDenom, _Bid, _HowLong, _MaxTicket);
        const address = (0, core_1.contractAddress)(0, __gen_init);
        return new LotteryDraw(address, __gen_init);
    }
    static fromAddress(address) {
        return new LotteryDraw(address);
    }
    constructor(address, init) {
        this.abi = {
            types: LotteryDraw_types,
            getters: LotteryDraw_getters,
            receivers: LotteryDraw_receivers,
            errors: exports.LotteryDraw_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message === null) {
            body = new core_1.Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Ticket') {
            body = (0, core_1.beginCell)().store(storeTicket(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Tickets') {
            body = (0, core_1.beginCell)().store(storeTickets(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Prepare_rewards') {
            body = (0, core_1.beginCell)().store(storePrepare_rewards(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Distribute_rewards') {
            body = (0, core_1.beginCell)().store(storeDistribute_rewards(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'TicketId') {
            body = (0, core_1.beginCell)().store(storeTicketId(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'IncreaseTime') {
            body = (0, core_1.beginCell)().store(storeIncreaseTime(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'DecreaseTime') {
            body = (0, core_1.beginCell)().store(storeDecreaseTime(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Ownership') {
            body = (0, core_1.beginCell)().store(storeOwnership(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'IncreaseTicket') {
            body = (0, core_1.beginCell)().store(storeIncreaseTicket(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'DecreaseTicket') {
            body = (0, core_1.beginCell)().store(storeDecreaseTicket(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Deploy') {
            body = (0, core_1.beginCell)().store(storeDeploy(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getRandomUint(provider, max, salt) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(max);
        builder.writeNumber(salt);
        const source = (await provider.get('random_uint', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetDecayWeight(provider, index) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(index);
        const source = (await provider.get('get_decay_weight', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetParticipantCount(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_participant_count', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetTotalPool(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_total_Pool', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetTicketData(provider, tk) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(tk);
        const source = (await provider.get('get_Ticket_Data', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleTicket_Owner(result_p) : null;
        return result;
    }
    async getGetTicketTotalData(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_Ticket_TotalData', builder.build())).stack;
        const result = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserTicket_Owner(), source.readCellOpt());
        return result;
    }
    async getGetTicketMap(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_Ticket_map', builder.build())).stack;
        const result = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
        return result;
    }
    async getGetBonusCount(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_BonusCount', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetPrize(provider, index) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(index);
        const source = (await provider.get('get_prize', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetMinPrize(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_MinPrize', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    async getGetBid(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_Bid', builder.build())).stack;
        const result = source.readString();
        return result;
    }
}
exports.LotteryDraw = LotteryDraw;
LotteryDraw.storageReserve = 0n;
LotteryDraw.errors = exports.LotteryDraw_errors_backward;
LotteryDraw.opcodes = LotteryDraw_opcodes;
