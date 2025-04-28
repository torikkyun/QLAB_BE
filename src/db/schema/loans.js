import { mysqlTable, varchar, int, date } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const loans = mysqlTable('loans', {
  userId: int('user_id')
    .references(() => t.users.id)
    .notNull(),
  deviceId: int('device_id')
    .references(() => t.devices.id)
    .notNull(),
  dateReceived: date('date_received').notNull(),
  dateReturned: date('date_returned'),
  description: varchar({ length: 255 }),
});

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(t.users, {
    fields: [loans.userId],
    references: [t.users.id],
  }),
  device: one(t.devices, {
    fields: [loans.deviceId],
    references: [t.devices.id],
  }),
}));
