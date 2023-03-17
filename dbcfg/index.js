import sqlite3 from "sqlite3";
import dotenv from "dotenv"

dotenv.config()


const db = new sqlite3.Database(process.env.DB_FILE , (err)=>{
  err ? console.error(err.message) : console.log("Connected to the database");
})


export default db
