import pkg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    const hash = await bcrypt.hash('genesis_protocol', 10);
    
    // We execute the SQL as a raw string to avoid the parameter comma issue
    const rawSql = "INSERT INTO users (alias, password_hash, multiverse_wealth, vault_balance) VALUES ('Architect', '" + hash + "', 1000000, 0) ON CONFLICT (alias) DO NOTHING";
    
    await pool.query(rawSql);
    
    console.log('--- SYSTEM_OVERRIDE_SUCCESSFUL ---');
    console.log('--- USER_ARCHITECT_IS_LIVE ---');
    process.exit(0);
  } catch (err) {
    console.error('FINAL ERROR:', err.message);
    process.exit(1);
  }
}
setup();