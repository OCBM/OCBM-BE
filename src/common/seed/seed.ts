import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const group = await prisma.group.upsert({
    where: { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      groupname: 'Omnex Admin',
      role: 'ADMIN',
      permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE'],
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
    },
    update: {},
  });
  const organization = await prisma.organization.upsert({
    where: { organizationid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      organizationid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      organizationname: 'Flyerssoft Private Limited',
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
    },
    update: {},
  });

  const plant = await prisma.plant.upsert({
    where: { plantid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
    create: {
      plantid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      plantname: 'Chennai',
      image: '',
      description: 'Chennai Plant',
      createdAt: '2023-10-04T13:19:57.171Z',
      updatedAt: '2023-10-04T13:19:57.171Z',
    },
    update: {},
  });

  const admin = await prisma.admin.upsert({
    where: { username: 'abineshprabhakaran' },
    create: {
      userid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      username: 'abineshprabhakaran',
      name: 'Abinesh Prabhakaran',
      email: 'abinesh.prabhakaran@flyerssoft.com',
      employeeid: 'FEC0050',
      position: 'Software Engineer',
      role: 'ADMIN',
      groups: {
        connect: [
          {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      plants: {
        connect: [
          {
            plantid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      organization: {
        connect: [
          {
            organizationid: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          },
        ],
      },
      password: '$2b$10$PVhCLgY2.yi7de0s8FgTcuZjx18CTh2ffgZ8T6LSmYRIH5M7VJeQ6',
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
