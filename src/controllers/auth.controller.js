import db from '../db/db.js';
import { eq } from 'drizzle-orm';
import * as t from '../db/schema/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersController } from './users.controller.js';

async function login(body) {
  const { email, password } = body;
  const [user] = await db
    .select({
      id: t.users.id,
      email: t.users.email,
      password: t.users.password,
      roleName: t.roles.name,
    })
    .from(t.users)
    .leftJoin(t.roles, eq(t.users.roleId, t.roles.id))
    .where(eq(t.users.email, email));

  if (!user) {
    return { message: 'User not found' };
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return { message: 'Invalid password' };
  }
  const payload = {
    id: user.id,
    email: user.email,
    roleName: user.roleName,
  };

  // eslint-disable-next-line no-undef
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    access_token: token,
  };
}

async function register(body) {
  try {
    return await usersController.createUser(body);
  } catch (error) {
    return { message: error.message };
  }
}

export const authController = {
  login,
  register,
};
