import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://architect:PeBMRRpdS3AORpR8KTGp6dYXXxhjN3sO@dpg-d623v27pm1nc73flpcb0-a.virginia-postgres.render.com/volsim_pro_ledger?ssl=true',
  ssl: { rejectUnauthorized: false }
});

const sql = 'CREATE TABLE IF NOT EXISTS users (' +
    'id SERIAL PRIMARY KEY, ' +
    'alias VARCHAR(50) UNIQUE NOT NULL, ' +
    'password_hash TEXT NOT NULL, ' +
    'multiverse_wealth DECIMAL(20, 2) DEFAULT 1000000.00, ' +
    'vault_balance DECIMAL(20, 2) DEFAULT 0.00, ' +
    'kyc_status VARCHAR(20) DEFAULT \'PENDING\', ' +
    'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
'); ' +
'CREATE TABLE IF NOT EXISTS trades (' +
    'id SERIAL PRIMARY KEY, ' +
    'user_id INTEGER REFERENCES users(id), ' +
    'asset VARCHAR(20), ' +
    'volume DECIMAL(20, 2), ' +
    'pnl DECIMAL(20, 2), ' +
    'status VARCHAR(20), ' +
    'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
');';

async function setup() {
  try {
    await client.connect();
    console.log('--- CONNECTING TO RENDER ---');
    await client.query(sql);
    console.log('--- SCHEMA DEPLOYED SUCCESSFULLY ---');
  } catch (err) {
    console.error('--- ERROR ---', err);
  } finally {
    await client.end();
  }
}

setup();
