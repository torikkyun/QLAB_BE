import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, count, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function getAllUsers() {
  return await db
    .select({
      id: t.users.id,
      roleName: t.roles.name,
      firstName: t.users.firstName,
      lastName: t.users.lastName,
      email: t.users.email,
      phone: t.users.phone,
    })
    .from(t.users)
    .leftJoin(t.roles, eq(t.users.roleId, t.roles.id));
}

async function getUserById(params) {
  const [result] = await db
    .select({
      id: t.users.id,
      roleName: t.roles.name,
      firstName: t.users.firstName,
      lastName: t.users.lastName,
      email: t.users.email,
      phone: t.users.phone,
    })
    .from(t.users)
    .leftJoin(t.roles, eq(t.users.roleId, t.roles.id))
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
    return { message: error.message };
  }
}

async function updateUser(params, body) {
  try {
    await db.update(t.users).set(body).where(eq(t.users.id, params.userId));
    return await getUserById(params);
  } catch (error) {
    return { message: error.message };
  }
}

async function deleteUser(params) {
  await db.delete(t.users).where(eq(t.users.id, params.userId));
  return { message: 'User deleted' };
}

// TODO: chuyển sang controller khác
async function getUserStatistics() {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(t.users);

    const [borrowingUsers] = await db
      .select({
        count: count(),
      })
      .from(t.loans)
      .where(isNull(t.loans.dateReturned));

    return {
      totalUsers: totalUsers.count,
      borrowingUsers: borrowingUsers.count,
    };
  } catch (error) {
    return { message: error.message };
  }
}

export const usersController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics,
};
