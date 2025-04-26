import { mysqlTable, serial, varchar, integer } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const devices = mysqlTable('devices', {
  id: serial().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull(),
  code: varchar({ length: 50 }).notNull(),
  cost: integer().notNull(),
  description: varchar({ length: 255 }),
});

export const devicesRelations = relations(devices, ({ many }) => ({
  loanDetails: many(t.staff, {
    fields: [devices.id],
    references: [t.staff.id],
  }),
}));
