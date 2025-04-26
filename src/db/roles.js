import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const roles = mysqlTable('roles', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  staff: many(t.staff, {
    fields: [roles.id],
    references: [t.staff.roleId],
  }),
}));
