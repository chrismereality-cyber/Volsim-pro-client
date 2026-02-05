import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// IMPORTANT: The Health Check Route
app.get('/', (req, res) => res.send('BACKEND_ONLINE'));

app.post('/api/login', async (req, res) => {
  const { alias, security_key } = req.body;
  console.log('--- LOGIN ATTEMPT:', alias, '---');
  try {
    const result = await pool.query('SELECT * FROM users WHERE alias = ', [alias]);
    if (result.rows.length > 0) {
      // For now, simple check; we can add bcrypt back once connectivity is confirmed
      res.json({ success: true, wealth: result.rows[0].multiverse_wealth });
    } else {
      res.status(401).json({ error: 'USER_NOT_FOUND' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DATABASE_ERROR' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log('SYSTEM_READY_ON_PORT_' + PORT));