const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kanhaiya@100",
  database: "project_db"
});


app.post("/signup", (req, res) => {
  console.log("⚡ SIGNUP API HIT");
  console.log("Request Body:", req.body);

  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }

  const sql =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [first_name, last_name, email, password], (err, result) => {
    if (err) {
      console.log("Signup Error:", err.message);
      return res.json({ success: false, message: "Signup Failed" });
    }

    return res.json({ success: true, message: "Signup Successful" });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
