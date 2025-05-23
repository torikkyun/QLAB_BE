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

  await db.insert(t.roles).values([
    {
      name: 'Staff',
      description: 'Staff role',
    },
    {
      name: 'User',
      description: 'User role',
    },
  ]);

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

  const [availableStatus] = await db
    .insert(t.deviceStatuses)
    .values([
      {
        name: 'Có sẵn',
        description: 'Thiết bị đã sẵn sàng cho người dùng',
      },
      {
        name: 'Đang sử dụng',
        description: 'Thiết bị đang được sử dụng',
      },
    ])
    .$returningId(['id']);

  console.log('Device statuses seeded successfully');

  await db.insert(t.devices).values([
    {
      name: 'Laptop Dell XPS 13',
      code: 'LAP001',
      cost: 25000000,
      description: 'Laptop cao cấp cho công việc',
      statusId: availableStatus.id,
    },
    {
      name: 'Máy chiếu Epson',
      code: 'PRJ001',
      cost: 15000000,
      description: 'Máy chiếu độ phân giải cao',
      statusId: availableStatus.id,
    },
    {
      name: 'iPad Pro M1',
      code: 'TAB001',
      cost: 20000000,
      description: 'Máy tính bảng cho thiết kế',
      statusId: availableStatus.id,
    },
    {
      name: 'Bộ Arduino Starter Kit',
      code: 'ARD001',
      cost: 1500000,
      description: 'Bộ kit học tập Arduino',
      statusId: availableStatus.id,
    },
    {
      name: 'Raspberry Pi 4',
      code: 'RPI001',
      cost: 2000000,
      description: 'Máy tính mini cho lập trình',
      statusId: availableStatus.id,
    },
    {
      name: 'Màn hình Dell 27"',
      code: 'MON001',
      cost: 5000000,
      description: 'Màn hình độ phân giải 4K',
      statusId: availableStatus.id,
    },
    {
      name: 'Bàn phím cơ Logitech',
      code: 'KEY001',
      cost: 2000000,
      description: 'Bàn phím cơ học cho lập trình',
      statusId: availableStatus.id,
    },
    {
      name: 'Camera Sony A7III',
      code: 'CAM001',
      cost: 35000000,
      description: 'Máy ảnh chuyên nghiệp',
      statusId: availableStatus.id,
    },
  ]);

  console.log('Devices seeded successfully');
  process.exit(0);
}

seedData().catch((error) => {
  console.error('Error seeding data:', error);
  process.exit(1);
});
