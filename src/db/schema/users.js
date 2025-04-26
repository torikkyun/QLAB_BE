import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar({ length: 50 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull().unique(),
});

export const usersRelations = relations(users, ({ one }) => ({
  staff: one(t.staff, {
    fields: [users.id],
    references: [t.staff.id],
  }),
  guest: one(t.guests, {
    fields: [users.id],
    references: [t.guests.id],
  }),
}));
