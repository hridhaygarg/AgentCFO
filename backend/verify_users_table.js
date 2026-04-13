import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'db.oryionopjhbxjmrucxby.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '#Dl3ccx6500',
  ssl: { rejectUnauthorized: false }
});

async function verify() {
  try {
    await client.connect();
    
    // Check if users table exists and get column info
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Users table does not exist!');
    } else {
      console.log('✓ Users table exists with columns:');
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }
    
    // Count rows in each table
    console.log('\n=== ROW COUNTS ===');
    const tables = ['users', 'organisations', 'organisation_members', 'agents', 'api_logs'];
    for (const table of tables) {
      const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`${table}: ${countResult.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

verify();
