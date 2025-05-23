import { drizzle } from 'drizzle-orm/mysql2';
import 'dotenv/config';

// eslint-disable-next-line no-undef
const db = drizzle(process.env.DATABASE_URL);

export default db;
