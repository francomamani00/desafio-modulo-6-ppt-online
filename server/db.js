"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.firestore = void 0;
const admin = require("firebase-admin");
// import * as serviceAccount from "./key.json";
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-modulo-6-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
exports.firestore = firestore;
const rtdb = admin.database();
exports.rtdb = rtdb;
