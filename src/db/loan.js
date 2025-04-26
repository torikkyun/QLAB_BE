import { mysqlTable, serial, varchar, integer } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const users = mysqlTable('users', {
  id: serial().primaryKey().autoincrement(),
  staffId: integer('staff_id')
    .references(() => t.staff.id)
    .notNull(),
  guestId: integer('guest_id')
    .references(() => t.guests.id)
    .notNull(),
  loanAt: varchar('loan_at', { length: 255 }).notNull(),
  loanAmount: integer('loan_amount').notNull(),
  description: varchar({ length: 255 }),
});

export const usersRelations = relations(users, ({ one }) => ({
  staff: one(t.staff, {
    fields: [users.id],
    references: [t.staff.id],
  }),
}));
