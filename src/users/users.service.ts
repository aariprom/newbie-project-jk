import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createUserRequestDTO } from './dto/createUserRequest.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {
  }

  async createUser(params: any): Promise<User> {
    console.log('[user.service.ts] createUser() | params: ', params);
    const validatedParams = plainToInstance(createUserRequestDTO, params);
    const validationErrors = await validate(validatedParams);
    if (validationErrors.length > 0) {
      console.log('[user.service.ts] createUser() | validationErrors: ', validationErrors);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.pw, salt);
    const currentDateTime = (new Date()).toISOString();
    return this.prisma.user.create({
      data: {
        ...params,
        pw: hashedPassword,
        createdDate: currentDateTime,
        modifiedDate: currentDateTime,
      },
    });
  }

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

  async getUser(@Param('id') id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      }
    })
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
  }
}
