import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://architect:PeBMRRpdS3AORpR8KTGp6dYXXxhjN3sO@dpg-d623v27pm1nc73flpcb0-a.virginia-postgres.render.com/volsim_pro_ledger?ssl=true',
  ssl: { rejectUnauthorized: false }
});

async function repair() {
  try {
    await client.connect();
    console.log('--- RESETTING DATABASE ---');
    
    // Drop existing broken tables
    await client.query('DROP TABLE IF EXISTS trades;');
    await client.query('DROP TABLE IF EXISTS users;');
    
    // Recreate Clean Tables
    await client.query('CREATE TABLE users (id SERIAL PRIMARY KEY, alias TEXT UNIQUE, password_hash TEXT, multiverse_wealth NUMERIC, vault_balance NUMERIC, kyc_status TEXT DEFAULT \'PENDING\');');
    await client.query('CREATE TABLE trades (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), asset TEXT, volume NUMERIC, pnl NUMERIC, status TEXT);');

    console.log('--- REPAIR COMPLETE: TABLES ARE CLEAN ---');
  } catch (err) {
    console.error('--- REPAIR FAILED ---', err.message);
  } finally {
    await client.end();
  }
}

repair();
