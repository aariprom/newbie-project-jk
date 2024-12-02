import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EditUserProfileDto } from './dto/editUserProfile.dto';
import { UserResDto } from './dto/userRes.dto';
import { User } from '@prisma/client';
import { CredentialDto } from '../auth/dto/credential.dto';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async editProfile(userId: string, data: EditUserProfileDto): Promise<UserResDto> {
    const user = await this.prisma.user.update({
      data: {
        ...data,
      },
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        age: true,
        height: true,
        weight: true,
        sex: true,
        level: true,
        createdDate: true,
        profilePicUrl: true,
        privateProfile: true,
      },
    });
    return new UserResDto(user, true, user.privateProfile);
  }

  async getUserProfile(userId: string, targetUserId: string): Promise<UserResDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
        email: true,
        age: true,
        height: true,
        weight: true,
        sex: true,
        level: true,
        createdDate: true,
        profilePicUrl: true,
        privateProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return new UserResDto(user, userId === targetUserId, user.privateProfile);
  }

  async deleteUser(userId: string): Promise<UserResDto> {
    const user = await this.prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
      }
    });
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return new UserResDto(user, true, true);
  }

  async getPassword(userId: string): Promise<CredentialDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        pw: true,
      }
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return new CredentialDto(user);
  }
}
