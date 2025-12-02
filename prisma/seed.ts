import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: new Date('1990-01-01'),
      fitnessGoal: 'strength'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      dateOfBirth: new Date('1992-05-15'),
      fitnessGoal: 'hypertrophy'
    }
  });

  // Create sample gyms
  const gym1 = await prisma.gym.create({
    data: {
      name: 'PowerHouse Gym',
      type: 'commercial',
      location: 'Downtown',
      capacity: 100
    }
  });

  const gym2 = await prisma.gym.create({
    data: {
      name: 'Home Fitness',
      type: 'home',
      capacity: 5
    }
  });

  // Create sample memberships
  await prisma.membership.create({
    data: {
      userId: user1.id,
      gymId: gym1.id
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });