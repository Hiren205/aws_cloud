const fs   = require('fs');
const path = require('path');
const pool = require('./config');

async function runMigrations() {
  const client = await pool.connect();

  try {
    // ─────────────────────────────────────────
    // Create migrations tracker table if not exists
    // This table keeps track of which migrations have already run
    // ─────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) NOT NULL UNIQUE,
        run_at     TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Migrations table ready');

    // ─────────────────────────────────────────
    // Read all .sql files from migrations folder
    // sorted by filename (001, 002, 003 order)
    // ─────────────────────────────────────────
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();   // sorts by filename: 001, 002, 003...

    console.log(`📁 Found ${files.length} migration files`);

    for (const file of files) {
      // Check if this migration already ran
      const already = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      );

      if (already.rows.length > 0) {
        console.log(`⏭️  Skipping (already ran): ${file}`);
        continue;
      }

      // Read and run the SQL file
      console.log(`🔨 Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        // Mark migration as done
        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`✅ Done: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed: ${file}`);
        console.error(err.message);
        throw err;   // stop all migrations if one fails
      }
    }

    console.log('🎉 All migrations complete!');

  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('❌ Migration error:', err.message);
  process.exit(1);   // exit with error so CodeBuild knows it failed
});