import { mysqlTable, varchar, int, date } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const loans = mysqlTable('loans', {
  id: int().primaryKey().autoincrement(),
  userId: int('user_id')
    .references(() => t.users.id)
    .notNull(),
  loanAt: date('loan_at').notNull(),
  loanAmount: int('loan_amount').notNull(),
  description: varchar({ length: 255 }),
});

export const loansRelations = relations(loans, ({ one, many }) => ({
  user: one(t.users, {
    fields: [loans.userId],
    references: [t.users.id],
  }),
  loanDetails: many(t.loanDetails, {
    fields: [loans.id],
    references: [t.loanDetails.loanId],
  }),
}));
