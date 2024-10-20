const { PrismaClient } = require('@prisma/client');

/**
 * @type {PrismaClient | null}
 */
let prismaInstance = null;

class Prisma {
  constructor() {
    if (!prismaInstance) {
      try {
        prismaInstance = new PrismaClient();
      } catch (error) {
        console.error('Failed to create PrismaClient instance:', error);
        throw error;
      }
    }
  }

  /**
   * @returns {PrismaClient}
   */
  getInstance() {
    return prismaInstance;
  }
}

const prisma = new Prisma().getInstance();
module.exports = prisma;