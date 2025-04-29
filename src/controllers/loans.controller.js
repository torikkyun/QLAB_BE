import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, and, isNull } from 'drizzle-orm';

async function getAllLoans() {
  return await db
    .select({
      userId: t.loans.userId,
      deviceId: t.loans.deviceId,
      dateReceived: t.loans.dateReceived,
      dateReturned: t.loans.dateReturned,
      description: t.loans.description,
      deviceName: t.devices.name,
      deviceCode: t.devices.code,
      userName: t.users.firstName,
    })
    .from(t.loans)
    .leftJoin(t.devices, eq(t.loans.deviceId, t.devices.id))
    .leftJoin(t.users, eq(t.loans.userId, t.users.id));
}

async function getLoansByUserId(params) {
  return await db
    .select({
      userId: t.loans.userId,
      deviceId: t.loans.deviceId,
      dateReceived: t.loans.dateReceived,
      dateReturned: t.loans.dateReturned,
      description: t.loans.description,
      deviceName: t.devices.name,
      deviceCode: t.devices.code,
    })
    .from(t.loans)
    .leftJoin(t.devices, eq(t.loans.deviceId, t.devices.id))
    .where(eq(t.loans.userId, params.userId));
}

async function borrowDevices(body) {
  try {
    const { userId, devices } = body;

    const [userExists] = await db
      .select()
      .from(t.users)
      .where(eq(t.users.id, userId));

    if (!userExists) {
      throw new Error('User does not exist');
    }

    const loansToAdd = [];
    const results = { success: [], failed: [] };

    for (const device of devices) {
      try {
        const [deviceExists] = await db
          .select()
          .from(t.devices)
          .where(eq(t.devices.id, device.deviceId));

        if (!deviceExists) {
          results.failed.push({
            deviceId: device.deviceId,
            reason: 'Device does not exist',
          });
          continue;
        }

        const [loanExists] = await db
          .select()
          .from(t.loans)
          .where(
            and(
              eq(t.loans.deviceId, device.deviceId),
              isNull(t.loans.dateReturned),
            ),
          );

        if (loanExists) {
          results.failed.push({
            deviceId: device.deviceId,
            reason: 'Device is already borrowed',
          });
          continue;
        }

        loansToAdd.push({
          userId: userId,
          deviceId: device.deviceId,
          dateReceived: new Date(),
          description: device.description || null,
        });

        results.success.push({
          deviceId: device.deviceId,
        });
        await db
          .update(t.devices)
          .set({ statusId: 2 })
          .where(eq(t.devices.id, device.deviceId));

        results.success.push({
          deviceId: device.deviceId,
        });
      } catch (error) {
        results.failed.push({
          deviceId: device.deviceId,
          reason: error.message,
        });
      }
    }

    if (loansToAdd.length > 0) {
      await db.insert(t.loans).values(loansToAdd);
    }

    return {
      message: `Borrowed ${results.success.length} devices successfully`,
      results,
    };
  } catch (error) {
    return { message: error.message };
  }
}

async function returnDevices(body) {
  try {
    const { userId, devices } = body;
    const results = { success: [], failed: [] };

    for (const deviceId of devices) {
      try {
        const [loanExists] = await db
          .select()
          .from(t.loans)
          .where(
            and(
              eq(t.loans.deviceId, deviceId),
              eq(t.loans.userId, userId),
              isNull(t.loans.dateReturned),
            ),
          );

        if (!loanExists) {
          results.failed.push({
            deviceId,
            reason: 'No active loan found for this device',
          });
          continue;
        }

        await db
          .update(t.loans)
          .set({ dateReturned: new Date() })
          .where(
            and(
              eq(t.loans.deviceId, deviceId),
              eq(t.loans.userId, userId),
              isNull(t.loans.dateReturned),
            ),
          );

        await db
          .update(t.devices)
          .set({ statusId: 1 })
          .where(eq(t.devices.id, deviceId));

        results.success.push({ deviceId });
      } catch (error) {
        results.failed.push({
          deviceId,
          reason: error.message,
        });
      }
    }

    return {
      message: `Returned ${results.success.length} devices successfully`,
      results,
    };
  } catch (error) {
    return { message: error.message };
  }
}

export const loansController = {
  getAllLoans,
  getLoansByUserId,
  borrowDevices,
  returnDevices,
};
