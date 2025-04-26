import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const projects = mysqlTable('projects', {
  id: serial().primaryKey().autoincrement(),
  startDate: varchar('start_date', { length: 100 }).notNull(),
  endDate: varchar('end_date', { length: 100 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 255 }),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  projectMembers: many(t.projectMembers, {
    fields: [projects.id],
    references: [t.projectMembers.id],
  }),
}));
