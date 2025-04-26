import { mysqlTable, serial, varchar, int, date } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const users = mysqlTable('users', {
  id: serial().primaryKey().autoincrement(),
  staffId: int('staff_id')
    .references(() => t.staff.id)
    .notNull(),
  guestId: int('guest_id')
    .references(() => t.guests.id)
    .notNull(),
  loanAt: date('loan_at').notNull(),
  loanAmount: int('loan_amount').notNull(),
  description: varchar({ length: 255 }),
});

export const usersRelations = relations(users, ({ one }) => ({
  staff: one(t.staff, {
    fields: [users.id],
    references: [t.staff.id],
  }),
}));
