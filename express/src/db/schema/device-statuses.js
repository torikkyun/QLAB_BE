import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const deviceStatuses = mysqlTable('device_statuses', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }),
});

export const deviceStatusesRelations = relations(
  deviceStatuses,
  ({ many }) => ({
    devices: many(t.devices, {
      fields: [deviceStatuses.id],
      references: [t.devices.statusId],
    }),
  }),
);
