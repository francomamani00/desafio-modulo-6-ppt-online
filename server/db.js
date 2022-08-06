import * as admin from "firebase-admin";
// import * as serviceAccount from "./key.json";
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-modulo-6-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
const rtdb = admin.database();
export { firestore, rtdb };
