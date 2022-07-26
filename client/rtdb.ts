import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
const firebaseConfig = {
  apiKey: "NaZZG8bIFyM0LWbjN55m1O1Za2vLaZMUgaWf2nKl",
  databaseURL: "https://apx-modulo-6-default-rtdb.firebaseio.com",
  projectId: "apx-modulo-6",
  authDomain: "apx-modulo-6.firebaseapp.com",
};
let app = initializeApp(firebaseConfig);
let rtdb = getDatabase(app);
export { rtdb };
