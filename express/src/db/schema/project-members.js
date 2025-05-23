import { mysqlTable, int, boolean, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema.js';

export const projectMembers = mysqlTable(
  'project_members',
  {
    userId: int('user_id')
      .notNull()
      .references(() => t.users.id),
    projectId: int('project_id')
      .notNull()
      .references(() => t.projects.id),
    isManager: boolean('is_manager').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.projectId] })],
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(t.projects, {
    fields: [projectMembers.projectId],
    references: [t.projects.id],
  }),
  user: one(t.users, {
    fields: [projectMembers.userId],
    references: [t.users.id],
  }),
}));
