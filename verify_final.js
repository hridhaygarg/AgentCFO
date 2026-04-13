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
    
    console.log('=== ROW COUNTS ===\n');
    const tables = ['users', 'organisations', 'organisation_members', 'agents', 'api_logs'];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`${table}: ${result.rows[0].count} rows`);
    }
    
    // Get latest user details
    console.log('\n=== LATEST USER ===\n');
    const userResult = await client.query(`
      SELECT id, email, name, company, org_id, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Company: ${user.company}`);
      console.log(`Org ID: ${user.org_id}`);
      console.log(`Created: ${user.created_at}`);
    }
    
    // Get organisation for that user
    if (userResult.rows.length > 0) {
      const orgId = userResult.rows[0].org_id;
      const orgResult = await client.query(`
        SELECT id, name, slug, created_by, created_at 
        FROM organisations 
        WHERE id = $1
      `, [orgId]);
      
      if (orgResult.rows.length > 0) {
        const org = orgResult.rows[0];
        console.log('\n=== LINKED ORGANISATION ===\n');
        console.log(`Org ID: ${org.id}`);
        console.log(`Name: ${org.name}`);
        console.log(`Slug: ${org.slug}`);
        console.log(`Created By: ${org.created_by}`);
        console.log(`Created: ${org.created_at}`);
        console.log('\n✅ USER AND ORGANISATION LINKED SUCCESSFULLY');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

verify();
