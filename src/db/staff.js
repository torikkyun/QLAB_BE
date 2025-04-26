import { mysqlTable, integer, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const staff = mysqlTable('staff', {
  id: integer('id')
    .primaryKey()
    .references(() => t.users.id),
  roleId: integer('role_id')
    .references(() => t.roles.id)
    .notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(t.users, {
    fields: [staff.id],
    references: [t.users.id],
  }),
  role: one(t.roles, {
    fields: [staff.roleId],
    references: [t.roles.id],
  }),
}));
