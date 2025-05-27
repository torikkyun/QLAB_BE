import db from '../db/db.js';
import * as t from '../db/schema/schema.js';
import { eq, count, and, isNull, sql } from 'drizzle-orm';

async function getStatistics() {
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

    const [totalUsers] = await db.select({ count: count() }).from(t.users);

    const [borrowingUsers] = await db
      .select({ count: sql`COUNT(DISTINCT ${t.loans.userId})` })
      .from(t.loans)
      .where(isNull(t.loans.dateReturned));

    const monthlyLoans = await db
      .select({
        month: sql`DATE_FORMAT(${t.loans.dateReceived}, '%m')`,
        year: sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y')`,
        count: sql`COUNT(*)`,
      })
      .from(t.loans)
      .where(
        sql`${t.loans.dateReceived} >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)`,
      )
      .groupBy(
        sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y')`,
        sql`DATE_FORMAT(${t.loans.dateReceived}, '%m')`,
      )
      .orderBy(
        sql`DATE_FORMAT(${t.loans.dateReceived}, '%Y')`,
        sql`DATE_FORMAT(${t.loans.dateReceived}, '%m')`,
      );

    return {
      deviceStats: {
        totalDevices: totalDevices.count,
        availableDevices: availableDevices.count,
        borrowedDevices: borrowedDevices.count,
      },
      userStats: {
        totalUsers: totalUsers.count,
        borrowingUsers: borrowingUsers.count,
      },
      monthlyLoans: monthlyLoans.map((loan) => ({
        month: `${loan.month}/${loan.year}`,
        count: Number(loan.count),
      })),
    };
  } catch (error) {
    return { message: error.message };
  }
}

export const statisticsController = {
  getStatistics,
};
