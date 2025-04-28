import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function getAllUser() {
  return await db.select().from(t.users);
}

async function getUserById(params) {
  const [result] = await db
    .select()
    .from(t.users)
    .where(eq(t.users.id, params.userId));
  return result;
}

async function createUser(body) {
  const { password, ...rest } = body;
  const hash = bcrypt.hashSync(password, 10);
  try {
    const [user] = await db
      .insert(t.users)
      .values({
        ...rest,
        roleId: 2,
        password: hash,
      })
      .$returningId();
    return await getUserById({ userId: user.id });
  } catch (error) {
    return { message: error };
  }
}

async function updateUser(params, body) {
  const { ...rest } = body;
  try {
    await db
      .update(t.users)
      .set({
        ...rest,
      })
      .where(eq(t.users.id, params.userId));
    return await getUserById(params);
  } catch (error) {
    return { message: error };
  }
}

async function deleteUser(params) {
  await db.delete(t.users).where(eq(t.users.id, params.userId));
  return { message: 'User deleted' };
}

export const usersController = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
