import pkg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const { Client } = pkg;

async function start() {
  try {
    const rawData = fs.readFileSync('./db-config.json', 'utf8').trim();
    const config = JSON.parse(rawData);

    const client = new Client({
      connectionString: config.connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('--- CONNECTED ---');
    
    const hash = await bcrypt.hash(config.password, 10);
    
    // Attempting a very direct insert
    const res = await client.query(
      'INSERT INTO users (alias, password_hash, multiverse_wealth, vault_balance) VALUES ($1, $2, $3, $4) RETURNING id', 
      [config.alias, hash, 1000000, 0]
    );
    
    console.log('--- SUCCESS ---');
    console.log('ACCOUNT_CREATED_ID:', res.rows[0].id);
    
  } catch (err) {
    if (err.message.includes('already exists')) {
        console.log('--- NOTICE: Architect already exists in DB ---');
    } else {
        console.error('--- ERROR ---', err.message);
    }
  } process.exit();
}
start();