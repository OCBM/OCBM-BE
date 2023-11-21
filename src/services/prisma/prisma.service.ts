import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    await this.$disconnect();
  }

  //dynamic queries
  async create(tablename: string, data: object) {
    try {
      return await this[tablename].create({
        data: data,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
  async createMany(tablename: string, data: any) {
    try {
      return await this[tablename].createMany({
        data: data,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
  async createManywithUptions(tablename: string, data: any) {
    try {
      return await this[tablename].createMany(data);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(tablename: string, queryandData: object) {
    try {
      return await this[tablename].update(queryandData);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
  async updateMany(tablename: string, queryandData: object) {
    try {
      return await this[tablename].updateMany(queryandData);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMany(tablename: string, query: object) {
    try {
      return await this[tablename].findMany(
        {
          orderBy: [
            {
              createdAt: 'asc',
            },
          ],
        },
        query,
      );
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUnique(tablename: string, query: object) {
    try {
      return await this[tablename].findUnique(query);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
  async findfirst(tablename: string, query: object) {
    try {
      return await this[tablename].findFirst(query);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(tablename: string, query: object) {
    try {
      return await this[tablename].delete(query);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
  async deleteMany(tablename: string, query: object) {
    try {
      return await this[tablename].deleteMany(query);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
}

// @Injectable()
// export class PrismaDynamicQueries {
//   constructor(private readonly prisma: PrismaService) {}
//   async create(tablename: string, data: object) {
//     try {
//       return await this.prisma[tablename].create({
//         data: data,
//       });
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }
//   async createMany(tablename: string, data: object) {
//     try {
//       return await this.prisma[tablename].createMany({
//         data: data,
//       });
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }

//   async update(tablename: string, query: object, data: object) {
//     try {
//       return await this.prisma[tablename].update({
//         where: query,
//         data: data,
//       });
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }
//   async updateMany(tablename: string, query: object, data: any) {
//     try {
//       return await this.prisma[tablename].updateMany({
//         where: query,
//         data: data,
//       });
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }

//   async findMany(tablename: string, query: object) {
//     try {
//       return await this.prisma[tablename].findMany(query);
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }

//   async findUnique(tablename: string, query: object) {
//     try {
//       return await this.prisma[tablename].findUnique(query);
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }
//   async findfirst(tablename: string, query: object) {
//     try {
//       return await this.prisma[tablename].findFirst(query);
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }

//   async delete(tablename: string, query: object) {
//     try {
//       return await this.prisma[tablename].delete(query);
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }
//   async deleteMany(tablename: string, query: object) {
//     try {
//       return await this.prisma[tablename].deleteMany(query);
//     } catch (error: any) {
//       throw new InternalServerErrorException(error);
//     }
//   }
// }
