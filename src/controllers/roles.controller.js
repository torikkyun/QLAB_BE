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
    .where(eq(t.roles.id, params.roleId));
  return result;
}

async function createRole(body) {
  try {
    const [roleExists] = await db
      .select()
      .from(t.roles)
      .where(eq(t.roles.name, body.name));
    if (roleExists) {
      throw new Error('Role name already exists');
    }
    const [role] = await db.insert(t.roles).values(body).$returningId();
    return getRoleById(role);
  } catch (error) {
    return { message: error.message };
  }
}

async function updateRole(params, body) {
  try {
    await db.update(t.roles).set(body).where(eq(t.roles.id, params.roleId));
    return await getRoleById(params);
  } catch (error) {
    return { message: error.message };
  }
}

async function deleteRole(params) {
  await db.delete(t.roles).where(eq(t.roles.id, params.roleId));
  return { message: 'Role deleted' };
}

export const rolesController = {
  getAllRole,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
