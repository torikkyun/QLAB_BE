import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, sql, and, isNull, isNotNull, count } from 'drizzle-orm';

async function getAllLoans() {
  return await db
    .select({
      user: {
        id: t.users.id,
        firstName: t.users.firstName,
        lastName: t.users.lastName,
        email: t.users.email,
        phone: t.users.phone,
      },
      device: {
        id: t.devices.id,
        name: t.devices.name,
        code: t.devices.code,
      },
      dateReceived: t.loans.dateReceived,
      dateReturned: t.loans.dateReturned,
      description: t.loans.description,
    })
    .from(t.loans)
    .leftJoin(t.devices, eq(t.loans.deviceId, t.devices.id))
    .leftJoin(t.users, eq(t.loans.userId, t.users.id));
}

async function getLoansByUserId(params) {
  return await db
    .select({
      user: {
        id: t.users.id,
        firstName: t.users.firstName,
        lastName: t.users.lastName,
        email: t.users.email,
        phone: t.users.phone,
      },
      device: {
        id: t.devices.id,
        name: t.devices.name,
        code: t.devices.code,
      },
      dateReceived: t.loans.dateReceived,
      dateReturned: t.loans.dateReturned,
      description: t.loans.description,
    })
    .from(t.loans)
    .leftJoin(t.devices, eq(t.loans.deviceId, t.devices.id))
    .leftJoin(t.users, eq(t.loans.userId, t.users.id))
    .where(eq(t.loans.userId, params.userId));
}

// TODO: tối ưu lại hàm này
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

// TODO: chuyển sang controller khác
async function getLoanStatistics() {
  try {
    // Giữ nguyên phần tính toán tổng số liệu
    const [totalLoans] = await db.select({ count: count() }).from(t.loans);

    const [unreturned] = await db
      .select({ count: count() })
      .from(t.loans)
      .where(isNull(t.loans.dateReturned));

    const [returned] = await db
      .select({ count: count() })
      .from(t.loans)
      .where(isNotNull(t.loans.dateReturned));

    // Thêm phần dữ liệu cho biểu đồ
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      months.unshift(date.toISOString().slice(0, 7));
    }

    const borrowData = await db
      .select({
        month: sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y-%m')`,
        count: count(),
      })
      .from(t.loans)
      .where(sql`${t.loans.dateReceived} >= ${sixMonthsAgo}`)
      .groupBy(sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y-%m')`);

    const returnData = await db
      .select({
        month: sql`DATE_FORMAT(${t.loans.dateReturned}, '%Y-%m')`,
        count: count(),
      })
      .from(t.loans)
      .where(sql`${t.loans.dateReturned} >= ${sixMonthsAgo}`)
      .groupBy(sql`DATE_FORMAT(${t.loans.dateReturned}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${t.loans.dateReturned}, '%Y-%m')`);

    const borrowCounts = months.map((month) => {
      const data = borrowData.find((d) => d.month === month);
      return data ? data.count : 0;
    });

    const returnCounts = months.map((month) => {
      const data = returnData.find((d) => d.month === month);
      return data ? data.count : 0;
    });

    return {
      totalLoans: totalLoans.count,
      unreturnedLoans: unreturned.count,
      returnedLoans: returned.count,
      chartData: {
        labels: months,
        borrowCounts,
        returnCounts,
      },
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
  getLoanStatistics,
};
