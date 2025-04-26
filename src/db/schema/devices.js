import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const devices = mysqlTable('devices', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull(),
  code: varchar({ length: 50 }).notNull(),
  cost: int().notNull(),
  description: varchar({ length: 255 }),
});

export const devicesRelations = relations(devices, ({ many }) => ({
  loanDetails: many(t.loanDetails, {
    fields: [devices.id],
    references: [t.loanDetails.deviceId],
  }),
}));
