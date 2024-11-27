import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EditUserProfileDto } from './dto/editUserProfile.dto';
import { S3Service } from '../S3/s3.service';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService,
              private readonly s3Service: S3Service,) {}

  async editProfile(userId: string, body: any) {
    const validated = plainToInstance(EditUserProfileDto, body);
    const validationErrors = await validate(validated);
    if (validationErrors.length > 0) {
      throw new HttpException('Invalid data to edit user profile.', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.user.update({
      data: validated,
      where: {
        id: userId,
      },
    });
  }

  async getUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      }
    })
  }

  /*
    async updateUser(params: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    }): Promise<User> {
      const { where, data } = params;
      return this.prisma.user.update({
        data,
        where,
      });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
      return this.prisma.user.delete({
        where,
      });
    }

    async getUsers(params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    }*/
}
