import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const { Pool } = pkg;
const app = express();

// RELAXED CORS: Allows any origin to hit the API (Best for debugging Vercel/Render)
app.use(cors({ origin: '*' })); 
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/api/login', async (req, res) => {
  const { alias, password } = req.body;
  console.log(`--- LOGIN ATTEMPT: ${alias} ---`); // This will show in Render Logs
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE alias = $1', [alias]);
    const user = result.rows[0];

    if (!user) {
      console.log('--- ERROR: USER NOT FOUND ---');
      return res.status(401).json({ error: 'USER_NOT_FOUND' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (valid) {
      const token = jwt.sign({ id: user.id }, 'VOLSIM_SECRET_777', { expiresIn: '24h' });
      console.log('--- SUCCESS: SESSION GRANTED ---');
      res.json({ 
        token, 
        user: { alias: user.alias, wealth: user.multiverse_wealth, vault: user.vault_balance } 
      });
    } else {
      console.log('--- ERROR: INVALID PASSWORD ---');
      res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
  } catch (err) {
    console.error('--- DATABASE ERROR ---', err.message);
    res.status(500).json({ error: 'DB_CONNECTION_FAILED' });
  }
});

app.post('/api/sync-vault', async (req, res) => {
  const { alias, newWealth, newVault } = req.body;
  try {
    await pool.query(
      'UPDATE users SET multiverse_wealth = $1, vault_balance = $2 WHERE alias = $3',
      [newWealth, newVault, alias]
    );
    res.json({ status: 'SYNCED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`SYSTEM_READY_ON_PORT_${PORT}`));