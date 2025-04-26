import db from '../db/db.js';
import * as t from '../db/schema/schema.js';

export async function getStaff() {
  const staff = await db
    .select()
    .from(t.staff)
    .leftJoin(t.users, t.users.id, t.staff.id)
    .leftJoin(t.roles, t.roles.id, t.staff.roleId);

  return staff;
}

export async function getStaffById(id: number) {}

export async function createStaff() {
  const staff = await db.insert(t.staff).values({
    id: 1,
    roleId: 1,
    password: 'password',
  });
  return staff;
}
