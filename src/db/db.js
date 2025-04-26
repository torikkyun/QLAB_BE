import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'data_QLAB',
});

const db = drizzle(connection);

export default db;
