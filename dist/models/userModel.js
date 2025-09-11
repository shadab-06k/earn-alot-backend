"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralCollection = exports.getTicketCollection = exports.getUserCollection = void 0;
const getUserCollection = (db) => db.collection("users");
exports.getUserCollection = getUserCollection;
const getTicketCollection = (db) => db.collection("tickets");
exports.getTicketCollection = getTicketCollection;
const getReferralCollection = (db) => db.collection("referrals");
exports.getReferralCollection = getReferralCollection;
