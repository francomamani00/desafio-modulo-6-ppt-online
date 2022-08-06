"use strict";
exports.__esModule = true;
exports.rtdb = exports.firestore = void 0;
var admin = require("firebase-admin");
// import * as serviceAccount from "./key.json";
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-modulo-6-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var rtdb = admin.database();
exports.rtdb = rtdb;
