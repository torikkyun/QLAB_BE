import db from '../db/db.js';
import { eq } from 'drizzle-orm';
import * as t from '../db/schema/schema.js';

async function getAllRole() {
  return await db.select().from(t.roles);
}

async function getRoleById(params) {
  const [result] = await db
    .select()
    .from(t.roles)
    .where(eq(t.roles.id, params.id));
  return result;
}

async function createRole(body) {
  const { name, description } = body;

  const [roleExists] = await db
    .select()
    .from(t.roles)
    .where(eq(t.roles.name, name));

  if (roleExists) {
    throw new Error('Role name already exists');
  }

  const [role] = await db
    .insert(t.roles)
    .values({ name, description })
    .$returningId();

  return getRoleById(role);
}

async function updateRole(params, body) {
  await db.update(t.roles).set(body).where(eq(t.roles.id, params.id));
  return getRoleById(params);
}

async function deleteRole(params) {
  await db.delete(t.roles).where(eq(t.roles.id, params.id));
}

export const rolesController = {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
