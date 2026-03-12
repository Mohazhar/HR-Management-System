import { db } from './src/lib/db';

async function checkSchema() {
    try {
        const result = await db.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Attendance';
    `;
        console.log('Columns in Attendance table:', JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();
