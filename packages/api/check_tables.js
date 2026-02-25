const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prisma/dev.db');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('Error listing tables:', err);
        } else {
            console.log('Tables in database:');
            tables.forEach(table => console.log(`- ${table.name}`));

            const hasSupportMessage = tables.some(t => t.name === 'SupportMessage');
            console.log('\nHas SupportMessage table:', hasSupportMessage);
        }
        db.close();
    });
});
