import { mysqlTable, varchar, int, date } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const loans = mysqlTable('loans', {
  id: int().primaryKey().autoincrement(),
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

export const loansRelations = relations(loans, ({ one, many }) => ({
  staff: one(t.staff, {
    fields: [loans.staffId],
    references: [t.staff.id],
  }),
  guest: one(t.guests, {
    fields: [loans.guestId],
    references: [t.guests.id],
  }),
  loanDetail: many(t.loanDetails, {
    fields: [loans.id],
    references: [t.loanDetails.loanId],
  }),
}));
