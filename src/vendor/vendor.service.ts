import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { Prisma } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class VendorService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(user_id: number, createVendorDto: CreateVendorDto) {
    try {
      const vendor = await this.prismaService.vendor.create({
        data: {
          user: {
            connect: {
              id: user_id,
            },
          },
          name: createVendorDto.name,
        },
      });
      return vendor;
    } catch (err) {
      console.log('Error Create Vendor: ', err);
      throw err;
    }
  }

  async findAll(query: QueryParamsDto) {
    try {
      const { take = 10, page = 1, search } = query;
      const skip = page * take - take;
      const where: Prisma.vendorWhereInput = {
        ...(search
          ? {
              name: {
                contains: search,
              },
            }
          : {}),
        is_active: true,
      };
      const count = await this.prismaService.vendor.count({
        where,
      });
      const vendors = await this.prismaService.vendor.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              roles: {
                select: {
                  name: true,
                },
              },
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              createdAt: true,
              updatedAt: true,
              is_active: true,
            },
          },
        },
      });
      return {
        data: vendors,
        meta: {
          total: count,
          page,
          take,
          takeTotal: vendors.length,
        },
      };
    } catch (err) {
      console.log('Error Find All Vendor: ', err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const vendor = await this.prismaService.vendor.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              roles: {
                select: {
                  name: true,
                },
              },
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              createdAt: true,
              updatedAt: true,
              is_active: true,
            },
          },
        },
      });
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
      return vendor;
    } catch (err) {
      console.log('Error Find One Vendor: ', err);
      throw err;
    }
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    try {
      const vendorUpdate = await this.prismaService.vendor.update({
        where: { id },
        data: {
          name: updateVendorDto.name,
          updatedAt: new Date(),
        },
      });

      return vendorUpdate;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Vendor not found');
      }

      console.error('Error Update Vendor:', err);
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const vendor = await this.prismaService.vendor.findUnique({
        where: {
          id,
        },
      });
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
      //SOFT DELETE
      const vendorDelete = await this.prismaService.vendor.update({
        where: {
          id,
        },
        data: {
          is_active: false,
          deletedAt: new Date(),
        },
      });
      return vendorDelete;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Vendor not found');
      }

      console.error('Error Delete Vendor:', err);
      throw err;
    }
  }
}
