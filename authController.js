const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    if (!first_name || !last_name || !email || !phone || !password)
      return res.status(400).json({ error: 'Missing fields' });

    db.query('SELECT id FROM users WHERE email = ? OR phone = ?', [email, phone], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length) return res.status(400).json({ error: 'Email or phone already exists' });

      const hashed = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (first_name, last_name, email, phone, password, created_by) VALUES (?,?,?,?,?,?)';
      db.query(sql, [first_name, last_name, email, phone, hashed, null], (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'User registered', id: result.insertId });
      });
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};


exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  });
};
