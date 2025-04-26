import db from '../db/db.js';
import * as t from '../db/schema/schema.js';

export const getAllUser = async () => {
  const result = await db.select().from(t.users);
  return result;
};

export const getUserById = async (id) => {
  const result = await db.select().from(t.users).where(t.users.id, id);
  return result;
};
