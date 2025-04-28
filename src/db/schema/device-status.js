import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const deviceStatus = mysqlTable('device_status', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
});

export const deviceStatusRelations = relations(deviceStatus, ({ many }) => ({
  devices: many(t.devices, {
    fields: [deviceStatus.id],
    references: [t.devices.statusId],
  }),
}));
