import { mysqlTable, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const guests = mysqlTable('guests', {
  id: int('id')
    .primaryKey()
    .references(() => t.users.id),
});

export const guestsRelations = relations(guests, ({ one }) => ({
  user: one(t.users, {
    fields: [guests.id],
    references: [t.users.id],
  }),
  loan: one(t.loans, {
    fields: [guests.id],
    references: [t.loan.guestId],
  }),
}));
