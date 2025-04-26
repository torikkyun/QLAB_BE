import db from '../db/db.js';
import * as t from '../db/schema/schema.js';

const getAllUser = async () => {
  const result = await db.select().from(t.users);
  return result;
};

export { getAllUser };
