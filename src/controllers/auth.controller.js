import db from '../db/db.js';
import { eq } from 'drizzle-orm';
import * as t from '../db/schema/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersController } from './users.controller.js';

async function login(body) {
  const { email, password } = body;
  const [user] = await db
    .select()
    .from(t.users)
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
    roleId: user.roleId,
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
