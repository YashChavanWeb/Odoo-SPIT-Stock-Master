import { prisma } from '../utils/prisma.js';

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database!');

    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;

    console.log('Available Tables:');
    tables.forEach((table) => {
      console.log(table.table_name);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};
