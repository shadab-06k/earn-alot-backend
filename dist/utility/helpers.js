"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMinutes = exports.now = void 0;
exports.formatAmPmIST = formatAmPmIST;
exports.secondsRemaining = secondsRemaining;
// utils/time.ts
const now = () => new Date();
exports.now = now;
const addMinutes = (d, minutes) => new Date(d.getTime() + minutes * 60 * 1000);
exports.addMinutes = addMinutes;
// human readable "12:00 AM" style in IST by default
function formatAmPmIST(date, tz = "Asia/Kolkata") {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}
// compute seconds left (never negative)
function secondsRemaining(endsAt) {
    const diffMs = endsAt.getTime() - Date.now();
    return Math.max(0, Math.floor(diffMs / 1000));
}
