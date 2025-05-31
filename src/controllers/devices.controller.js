import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, count, and, isNull, sql } from 'drizzle-orm';

async function getAllDevices() {
  return await db
    .select({
      id: t.devices.id,
      name: t.devices.name,
      code: t.devices.code,
      cost: t.devices.cost,
      description: t.devices.description,
      statusName: t.deviceStatuses.name,
    })
    .from(t.devices)
    .leftJoin(t.deviceStatuses, eq(t.devices.statusId, t.deviceStatuses.id));
}

async function getDeviceById(params) {
  const [result] = await db
    .select({
      id: t.devices.id,
      name: t.devices.name,
      code: t.devices.code,
      cost: t.devices.cost,
      description: t.devices.description,
      statusName: t.deviceStatuses.name,
    })
    .from(t.devices)
    .leftJoin(t.deviceStatuses, eq(t.devices.statusId, t.deviceStatuses.id))
    .where(eq(t.devices.id, params.deviceId));
  return result;
}

async function createDevice(body) {
  try {
    const [deviceExists] = await db
      .select()
      .from(t.devices)
      .where(eq(t.devices.code, body.code));

    if (deviceExists) {
      throw new Error('Device code already exists');
    }

    const [statusExists] = await db
      .select()
      .from(t.deviceStatuses)
      .where(eq(t.deviceStatuses.id, body.statusId));

    if (!statusExists) {
      throw new Error('Device status does not exist');
    }

    const [result] = await db.insert(t.devices).values(body).$returningId();
    return await getDeviceById({ deviceId: result.id });
  } catch (error) {
    return { message: error.message };
  }
}

async function updateDevice(params, body) {
  try {
    if (body.code) {
      const [deviceWithSameCode] = await db
        .select()
        .from(t.devices)
        .where(eq(t.devices.code, body.code));

      if (
        deviceWithSameCode &&
        deviceWithSameCode.id !== parseInt(params.deviceId)
      ) {
        throw new Error('Device code already exists');
      }
    }

    if (body.statusId) {
      const [statusExists] = await db
        .select()
        .from(t.deviceStatuses)
        .where(eq(t.deviceStatuses.id, body.statusId));

      if (!statusExists) {
        throw new Error('Device status does not exist');
      }
    }

    await db
      .update(t.devices)
      .set(body)
      .where(eq(t.devices.id, params.deviceId));
    return await getDeviceById(params);
  } catch (error) {
    return { message: error.message };
  }
}

async function deleteDevice(params) {
  try {
    const [loanExists] = await db
      .select()
      .from(t.loans)
      .where(eq(t.loans.deviceId, params.deviceId));

    if (loanExists) {
      throw new Error('Cannot delete device that is currently being borrowed');
    }

    await db.delete(t.devices).where(eq(t.devices.id, params.deviceId));
    return { message: 'Device deleted successfully' };
  } catch (error) {
    return { message: error.message };
  }
}

// TODO: chuyển sang controller khác
async function getDeviceStatistics() {
  try {
    const [totalDevices] = await db.select({ count: count() }).from(t.devices);

    const [availableDevices] = await db
      .select({ count: count() })
      .from(t.devices)
      .leftJoin(
        t.loans,
        and(eq(t.devices.id, t.loans.deviceId), isNull(t.loans.dateReturned)),
      )
      .where(isNull(t.loans.deviceId));

    const [borrowedDevices] = await db
      .select({ count: count() })
      .from(t.devices)
      .innerJoin(
        t.loans,
        and(eq(t.devices.id, t.loans.deviceId), isNull(t.loans.dateReturned)),
      );

    const topDevices = await db
      .select({
        id: t.devices.id,
        name: t.devices.name,
        code: t.devices.code,
        count: sql`COUNT(${t.loans.deviceId})`,
      })
      .from(t.devices)
      .leftJoin(t.loans, eq(t.devices.id, t.loans.deviceId))
      .groupBy(t.devices.id, t.devices.name, t.devices.code)
      .orderBy(sql`COUNT(${t.loans.deviceId}) DESC`)
      .limit(5);

    return {
      totalDevices: totalDevices.count,
      availableDevices: availableDevices.count,
      borrowedDevices: borrowedDevices.count,
      topDevices: topDevices.map((device) => ({
        id: device.id,
        name: device.name,
        code: device.code,
        count: Number(device.count),
      })),
    };
  } catch (error) {
    return { message: error.message };
  }
}

export const devicesController = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceStatistics,
};
