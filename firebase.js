import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  get
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2v2X8ee68-4hDYaWb5jK6SnQxAsTvaYU",
  authDomain: "alpacas-xmas.firebaseapp.com",
  projectId: "alpacas-xmas",
  storageBucket: "alpacas-xmas.firebasestorage.app",
  messagingSenderId: "36667948885",
  appId: "1:36667948885:web:19e0434c48bbe41a6939dc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export { db, ref, set, push, onValue, update,get };
