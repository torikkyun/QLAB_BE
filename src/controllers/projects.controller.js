import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq } from 'drizzle-orm';

async function getAllProjects() {
  return await db.select().from(t.projects);
}

async function getProjectById(params) {
  const [result] = await db
    .select()
    .from(t.projects)
    .where(eq(t.projects.id, params.projectId));
  return result;
}

async function createProject(body) {
  try {
    const [result] = await db.insert(t.projects).values(body).$returningId();
    return await getProjectById({ projectId: result.id });
  } catch (error) {
    return { message: error.message };
  }
}

async function updateProject(params, body) {
  try {
    await db
      .update(t.projects)
      .set(body)
      .where(eq(t.projects.id, params.projectId));
    return await getProjectById(params);
  } catch (error) {
    return { message: error.message };
  }
}

async function deleteProject(params) {
  await db.delete(t.projects).where(eq(t.projects.id, params.projectId));
  return { message: 'Project deleted' };
}

export const projectsController = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
