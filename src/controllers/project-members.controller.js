import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, and } from 'drizzle-orm';

async function getProjectMembers(params) {
  const { projectId } = params;
  return await db
    .select({
      userId: t.projectMembers.userId,
      projectId: t.projectMembers.projectId,
      isManager: t.projectMembers.isManager,
      firstName: t.users.firstName,
      lastName: t.users.lastName,
      email: t.users.email,
      phone: t.users.phone,
    })
    .from(t.projectMembers)
    .leftJoin(t.users, eq(t.projectMembers.userId, t.users.id))
    .where(eq(t.projectMembers.projectId, projectId));
}

async function addProjectMember(body) {
  try {
    const [projectExists] = await db
      .select()
      .from(t.projects)
      .where(eq(t.projects.id, body.projectId));

    if (!projectExists) {
      throw new Error('Project does not exist');
    }

    const [userExists] = await db
      .select()
      .from(t.users)
      .where(eq(t.users.id, body.userId));

    if (!userExists) {
      throw new Error('User does not exist');
    }

    const [memberExists] = await db
      .select()
      .from(t.projectMembers)
      .where(
        and(
          eq(t.projectMembers.userId, body.userId),
          eq(t.projectMembers.projectId, body.projectId),
        ),
      );

    if (memberExists) {
      throw new Error('User is already a member of the project');
    }

    await db.insert(t.projectMembers).values({
      userId: body.userId,
      projectId: body.projectId,
      isManager: body.isManager || false,
    });

    return { message: 'Added member to project successfully' };
  } catch (error) {
    return { message: error.message };
  }
}

// TODO: tối ưu lại hàm này
async function addMultipleProjectMembers(params, body) {
  try {
    const [projectExists] = await db
      .select()
      .from(t.projects)
      .where(eq(t.projects.id, params.projectId));

    if (!projectExists) {
      throw new Error('Project does not exist');
    }

    const membersToAdd = [];
    const results = { success: [], failed: [] };

    for (const member of body.members) {
      try {
        const [userExists] = await db
          .select()
          .from(t.users)
          .where(eq(t.users.id, member.userId));

        if (!userExists) {
          results.failed.push({
            userId: member.userId,
            reason: 'User does not exist',
          });
          continue;
        }

        const [memberExists] = await db
          .select()
          .from(t.projectMembers)
          .where(
            and(
              eq(t.projectMembers.userId, member.userId),
              eq(t.projectMembers.projectId, params.projectId),
            ),
          );

        if (memberExists) {
          results.failed.push({
            userId: member.userId,
            reason: 'User is already a member of the project',
          });
          continue;
        }

        membersToAdd.push({
          userId: member.userId,
          projectId: params.projectId,
          isManager: member.isManager || false,
        });

        results.success.push({
          userId: member.userId,
        });
      } catch (error) {
        results.failed.push({
          userId: member.userId,
          reason: error.message,
        });
      }
    }

    if (membersToAdd.length > 0) {
      await db.insert(t.projectMembers).values(membersToAdd);
    }

    return {
      message: `Added ${results.success.length} member to project`,
      results,
    };
  } catch (error) {
    return { message: error.message };
  }
}

async function removeProjectMember(params) {
  try {
    const { projectId, userId } = params;

    await db
      .delete(t.projectMembers)
      .where(
        and(
          eq(t.projectMembers.userId, userId),
          eq(t.projectMembers.projectId, projectId),
        ),
      );

    return { message: 'Member removed from project' };
  } catch (error) {
    return { message: error.message };
  }
}

async function updateProjectMember(params, body) {
  try {
    const { projectId, userId } = params;

    await db
      .update(t.projectMembers)
      .set({ isManager: body.isManager })
      .where(
        and(
          eq(t.projectMembers.userId, userId),
          eq(t.projectMembers.projectId, projectId),
        ),
      );

    return { message: 'Updated project member roles' };
  } catch (error) {
    return { message: error.message };
  }
}

export const projectMembersController = {
  getProjectMembers,
  addProjectMember,
  addMultipleProjectMembers,
  removeProjectMember,
  updateProjectMember,
};
