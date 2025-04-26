import {
  mysqlTable,
  integer,
  boolean,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as t from './schema';

export const projectMembers = mysqlTable(
  'project_members',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => t.users.id),
    projectId: integer('group_id')
      .notNull()
      .references(() => t.projects.id),
    isManager: boolean('is_manager').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(t.projects, {
    fields: [projectMembers.projectId],
    references: [t.projects.id],
  }),
  user: one(t.users, {
    fields: [t.users.userId],
    references: [t.users.id],
  }),
}));
