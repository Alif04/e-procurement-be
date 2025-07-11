import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(user_id: number, createProductDto: CreateProductDto) {
    try {
      const user_vendor = await this.prismaService.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          vendor: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user_vendor) {
        throw new Error('User is not a vendor');
      }
      const product = await this.prismaService.product.create({
        data: {
          vendor: {
            connect: {
              id: user_vendor.vendor?.id,
            },
          },
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
        },
      });

      return product;
    } catch (error) {
      console.log('Error While Creating Product: ', error);
      throw error;
    }
  }

  async findAll(query: QueryParamsDto) {
    try {
      const { take = 10, page = 1, search } = query;
      const skip = page * take - take;
      const where: Prisma.productWhereInput = {
        ...(search
          ? {
              name: {
                contains: search,
              },
            }
          : {}),
        is_active: true,
      };
      const count = await this.prismaService.product.count({
        where,
      });
      const products = await this.prismaService.product.findMany({
        where,
        skip,
        take,
      });
      return {
        data: products,
        meta: {
          total: count,
          page,
          take,
          takeTotal: products.length,
        },
      };
    } catch (error) {
      console.log('Error While Finding All Product: ', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id,
        },
      });
      if (!product) {
        throw new NotFoundException('Product Not Found');
      }
      return product;
    } catch (error) {
      console.log('Error While Finding One Product: ', error);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          updatedAt: new Date(),
        },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return product;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }

      console.error('Error Delete Product:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      //SOFT DELETE
      const product = await this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      return product;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }

      console.error('Error Delete Product:', error);
      throw error;
    }
  }
}
