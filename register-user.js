import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://architect:PeBMRRpdS3AORpR8KTGp6dYXXxhjN3sO@dpg-d623v27pm1nc73flpcb0-a.virginia-postgres.render.com/volsim_pro_ledger?ssl=true',
  ssl: { rejectUnauthorized: false }
});

async function register() {
  try {
    const alias = 'Architect';
    const password = 'genesis_protocol';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await client.connect();
    console.log('--- ATTEMPTING ATOMIC INSERT ---');
    
    // We remove the commas and numeric values temporarily to find the leak
    const query = 'INSERT INTO users (alias, password_hash) VALUES (, ) RETURNING id';
    const values = [alias, hash];

    const res = await client.query(query, values);
    console.log('--- SUCCESS! USER_ID:', res.rows[0].id, '---');

    // If that worked, we update the wealth separately
    await client.query('UPDATE users SET multiverse_wealth = 1000000, vault_balance = 0 WHERE alias = ', [alias]);
    console.log('--- WEALTH INITIALIZED ---');

  } catch (err) {
    console.error('--- DIAGNOSTIC ERROR ---', err.message);
  } finally {
    await client.end();
  }
}

register();
