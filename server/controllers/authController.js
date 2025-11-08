const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO login (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ message: 'Signup failed' });
    return res.status(200).json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM login WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    console.log('User found:', user.email);
    console.log('Comparing password...');

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.email);
    res.status(200).json({ message: 'Login successful' });
  });
};

