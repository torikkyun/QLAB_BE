import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  roleId: int('role_id')
    .references(() => t.roles.id)
    .notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar({ length: 50 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(t.roles, {
    fields: [users.roleId],
    references: [t.roles.id],
  }),
  loans: many(t.loans, {
    fields: [users.id],
    references: [t.loans.userId],
  }),
  projectMembers: many(t.projectMembers, {
    fields: [users.id],
    references: [t.projectMembers.userId],
  }),
}));
