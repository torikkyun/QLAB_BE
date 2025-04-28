/* eslint-disable no-undef */
import db from './db.js';
import * as t from './schema/schema.js';
import bcrypt from 'bcryptjs';

async function seedAdminUser() {
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
  process.exit(0);
}

seedAdminUser().catch((error) => {
  console.error('Error seeding admin user:', error);
  process.exit(1);
});
