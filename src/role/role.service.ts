import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { Prisma } from 'generated/prisma';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.prismaService.roles.create({
        data: {
          name: createRoleDto.name,
        },
      });
      return role;
    } catch (err) {
      console.log('Error Create Role: ', err);
      throw err;
    }
  }

  async findAll(query: QueryParamsDto) {
    try {
      const { take = 10, page = 1, search } = query;
      const skip = page * take - take;
      const where: Prisma.rolesWhereInput = {
        ...(search
          ? {
              name: {
                contains: search,
              },
            }
          : {}),
        is_active: true,
      };
      const count = await this.prismaService.roles.count({
        where,
      });
      const roles = await this.prismaService.roles.findMany({
        where,
        skip,
        take,
      });
      return {
        data: roles,
        meta: {
          total: count,
          page,
          take,
          takeTotal: roles.length,
        },
      };
    } catch (error) {
      console.log('Error While Finding All Roles: ', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.prismaService.roles.findUnique({
        where: {
          id,
        },
      });
      if (!role) {
        throw new NotFoundException('Role Not Found');
      }
      return role;
    } catch (error) {
      console.log('Error While Finding One Role: ', error);
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.prismaService.roles.update({
        where: {
          id,
        },
        data: {
          name: updateRoleDto.name,
          updatedAt: new Date(),
        },
      });
      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Role not found');
      }
      console.log('Error While Updating Role: ', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const role = await this.prismaService.roles.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          is_active: false,
        },
      });
      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Role not found');
      }
      console.log('Error While Deleting Role: ', error);
      throw error;
    }
  }
}
