import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const group = await prisma.group.upsert({
    where: { groupId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      groupId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      groupName: 'Omnex Admin',
      services: {
        create: [
          {
            serviceName: 'plant',
            permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
          },
        ],
      },
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
    },
    update: {},
  });

  const organization = await prisma.organization.upsert({
    where: { organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      organizationName: 'Flyerssoft Private Limited',
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
    },
    update: {},
  });

  const plant = await prisma.plant.upsert({
    where: { plantId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      plantId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      plantName: 'Chennai',
      image: '',
      imageName: 'Chennai.png',
      description: 'Chennai Plant',
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
      organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    },
    update: {},
  });

  const admin = await prisma.admin.upsert({
    where: { userName: 'abineshprabhakaran' },
    create: {
      userId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      userName: 'abineshprabhakaran',
      name: 'Abinesh Prabhakaran',
      email: 'abinesh.prabhakaran@flyerssoft.com',
      employeeId: 'FEC0050',
      position: 'Software Engineer',
      role: 'ADMIN',
      groups: {
        connect: [
          {
            groupId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      organization: {
        connect: [
          {
            organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      plants: {
        connect: [
          {
            plantId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      password: '$2b$10$PVhCLgY2.yi7de0s8FgTcuZjx18CTh2ffgZ8T6LSmYRIH5M7VJeQ6',
    },
    update: {},
  });

  const shop = await prisma.shop.upsert({
    where: { shopId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      shopId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      shopName: 'Chennai',
      description: 'Chennai Plant',
      image: '',
      imageName: 'Chennai.png',
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
      plantId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    },
    update: {},
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
