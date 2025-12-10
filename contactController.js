
const db = require('../db');


exports.create = (req, res) => {
  const userId = req.user.id; 
  const { contact_number, contact_email, note } = req.body;

  if (!contact_number) return res.status(400).json({ error: 'contact_number required' });

  const checkSql = 'SELECT id FROM users_contact WHERE user_id = ? AND contact_number = ?';
  db.query(checkSql, [userId, contact_number], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0) return res.status(400).json({ error: 'Contact number already exists for this user' });

    const sql = `INSERT INTO users_contact (user_id, contact_number, contact_email, note, created_by)
                 VALUES (?,?,?,?,?)`;
    db.query(sql, [userId, contact_number, contact_email || null, note || null, userId], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Contact added', id: result.insertId });
    });
  });
};


exports.list = (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT id, contact_number, contact_email, note, created_at FROM users_contact WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
