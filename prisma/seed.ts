import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // const user = await prisma.user.create({
  //   data: {
  //     name: faker.name.fullName(),
  //     email: faker.internet.email(),
  //     password: '$2b$10$3KAjHfOm/Q1G6vcjunDfSOF6XerN3Grq8Es3L3VtCKwZ4X4wmNy1e', // password
  //   },
  // });
  // console.log(user);
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