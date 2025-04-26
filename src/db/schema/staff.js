import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const staff = mysqlTable('staff', {
  id: int()
    .primaryKey()
    .references(() => t.users.id),
  roleId: int('role_id')
    .notNull()
    .references(() => t.roles.id),
  password: varchar({ length: 255 }).notNull(),
});

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(t.users, {
    fields: [staff.id],
    references: [t.users.id],
  }),
  role: one(t.roles, {
    fields: [staff.roleId],
    references: [t.roles.id],
  }),
  project: many(t.projectMembers, {
    fields: [staff.id],
    references: [t.projectMembers.userId],
  }),
  loan: many(t.loans, {
    fields: [staff.id],
    references: [t.loans.staffId],
  }),
}));
