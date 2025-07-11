import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { user } from 'generated/prisma';
import { JwtConfig } from 'src/jwt.config';

type SafeUser = Omit<user, 'password' | 'created_at' | 'updated_at' | 'deleted_at'> & {
  roles?: any;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prismaService.user.create({
        data: {
          roles: {
            connect: {
              id: dto.role_id,
            },
          },
          name: dto.name,
          email: dto.email,
          password: hashed,
        },
      });

      return user;
    } catch (e) {
      console.log(e);
      const errorMessage = e instanceof Error ? e.message : 'An error occurred';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  generateJwt(user: user, secret: string, expired = JwtConfig.user_expired, roleUser: string) {
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }

    const { id, email, role_id } = user;

    const accessToken = this.jwtService.sign(
      {
        id: id,
        email,
        role_id,
      },
      {
        expiresIn: expired,
        secret,
      },
    );

    const role = roleUser ?? 'user';
    const expiresIn = expired ?? JwtConfig.user_expired;

    const safeUser = omit(user, ['password', 'created_at', 'updated_at', 'deleted_at']) as SafeUser;

    return {
      accessToken,
      user: safeUser,
      role,
      expiresIn,
    };
  }

  async login(loginDto: LoginDto) {
    try {
      console.log('LOGIN DTO', loginDto.email, loginDto.password);
      const user = await this.prismaService.user.findFirst({
        where: {
          email: loginDto.email,
          is_active: true,
        },
        include: {
          roles: true,
        },
      });
      console.log(user);
      if (!user) {
        throw new HttpException('Username atau Password salah', HttpStatus.UNAUTHORIZED);
      }
      console.log('Input password:', loginDto.password);
      console.log('Stored hash:', user.password);
      const checkPassword = await bcrypt.compare(loginDto.password, user.password);
      console.log('Check result:', checkPassword);
      if (!checkPassword) {
        throw new HttpException('Username atau Password salah', HttpStatus.UNAUTHORIZED);
      }

      if (!JwtConfig.user_secret) {
        throw new Error('JWT secret is not defined');
      }

      const token = this.generateJwt(
        user,
        JwtConfig.user_secret,
        JwtConfig.user_expired,
        user.roles.name,
      );
      return token;
    } catch (e) {
      console.log(e);
      const errorMessage = e instanceof Error ? e.message : 'An error occurred';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
