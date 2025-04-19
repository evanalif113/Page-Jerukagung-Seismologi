import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDalcCwwOthPMjC3umkpQECqlQQj699FTY",
  authDomain: "staklimjerukagung.firebaseapp.com",
  databaseURL: "https://staklimjerukagung-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "staklimjerukagung",
  storageBucket: "staklimjerukagung.appspot.com",
  messagingSenderId: "763003005982",
  appId: "1:763003005982:web:8ce295eda92c6b9112d20f",
  measurementId: "G-DRL05TMRNT",
}

let app
let analytics
let database

// Initialize Firebase only on client side
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig)
  analytics = getAnalytics(app)
  database = getDatabase(app)
}

export { app, analytics, database }
