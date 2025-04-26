import { mysqlTable, int, primaryKey, date } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const loanDetails = mysqlTable(
  'loan_details',
  {
    deviceId: int('user_id')
      .notNull()
      .references(() => t.users.id),
    loanId: int('group_id')
      .notNull()
      .references(() => t.projects.id),
    dateReceived: date('date_received').notNull(),
    dateReturned: date('date_returned').notNull(),
    actualReturned: date('actual_returned'),
  },
  (t) => [primaryKey({ columns: [t.deviceId, t.loanId] })],
);

export const loanDetailsRelations = relations(loanDetails, ({ one }) => ({
  loan: one(t.loans, {
    fields: [loanDetails.loanId],
    references: [t.loans.id],
  }),
  device: one(t.devices, {
    fields: [loanDetails.deviceId],
    references: [t.devices.id],
  }),
}));
