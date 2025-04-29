/* eslint-disable no-undef */
import db from './db.js';
import * as t from './schema/schema.js';
import bcrypt from 'bcryptjs';

async function seedData() {
  const hash = bcrypt.hashSync('123456', 10);

  const [adminRole] = await db
    .insert(t.roles)
    .values({
      name: 'Admin',
      description: 'Administrator role',
    })
    .$returningId();

  await db.insert(t.roles).values({
    name: 'Staff',
    description: 'Staff role',
  });

  await db
    .insert(t.users)
    .values({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gmail.com',
      phone: '1234567890',
      password: hash,
      roleId: adminRole.id,
    })
    .$returningId();

  console.log('Admin user seeded successfully');

  await db.insert(t.deviceStatuses).values([
    {
      name: 'Available',
      description: 'Device is available for use',
    },
    {
      name: 'In Use',
      description: 'Device is currently being used',
    },
    {
      name: 'Maintenance',
      description: 'Device is under maintenance',
    },
    {
      name: 'Broken',
      description: 'Device is broken and needs repair',
    },
    {
      name: 'Lost',
      description: 'Device is lost',
    },
  ]);

  console.log('Device statuses seeded successfully');
  process.exit(0);
}

seedData().catch((error) => {
  console.error('Error seeding data:', error);
  process.exit(1);
});
