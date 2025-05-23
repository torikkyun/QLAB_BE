import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq } from 'drizzle-orm';

async function getAllDeviceStatuses() {
  return await db.select().from(t.deviceStatuses);
}

async function getDeviceStatusById(params) {
  const [result] = await db
    .select()
    .from(t.deviceStatuses)
    .where(eq(t.deviceStatuses.id, params.statusId));
  return result;
}

async function createDeviceStatus(body) {
  try {
    const [statusExists] = await db
      .select()
      .from(t.deviceStatuses)
      .where(eq(t.deviceStatuses.name, body.name));

    if (statusExists) {
      throw new Error('Device status name already exists');
    }

    const [result] = await db
      .insert(t.deviceStatuses)
      .values(body)
      .$returningId();
    return await getDeviceStatusById({ statusId: result.id });
  } catch (error) {
    return { message: error.message };
  }
}

async function updateDeviceStatus(params, body) {
  try {
    if (body.name) {
      const [statusWithSameName] = await db
        .select()
        .from(t.deviceStatuses)
        .where(eq(t.deviceStatuses.name, body.name));

      if (
        statusWithSameName &&
        statusWithSameName.id !== parseInt(params.statusId)
      ) {
        throw new Error('Device status name already exists');
      }
    }

    await db
      .update(t.deviceStatuses)
      .set(body)
      .where(eq(t.deviceStatuses.id, params.statusId));
    return await getDeviceStatusById(params);
  } catch (error) {
    return { message: error.message };
  }
}

async function deleteDeviceStatus(params) {
  try {
    const [deviceExists] = await db
      .select()
      .from(t.devices)
      .where(eq(t.devices.statusId, params.statusId));

    if (deviceExists) {
      throw new Error(
        'Cannot delete status that is currently being used by a device',
      );
    }

    await db
      .delete(t.deviceStatuses)
      .where(eq(t.deviceStatuses.id, params.statusId));
    return { message: 'Device status deleted successfully' };
  } catch (error) {
    return { message: error.message };
  }
}

export const deviceStatusesController = {
  getAllDeviceStatuses,
  getDeviceStatusById,
  createDeviceStatus,
  updateDeviceStatus,
  deleteDeviceStatus,
};
