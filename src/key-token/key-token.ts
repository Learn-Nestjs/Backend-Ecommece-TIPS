import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateKeyToken, IGenTokenVerifyEmail, IGenerateTokenPair } from './interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class KeyToken {
  constructor(private prismaService: PrismaService) { }
  async createKeyToken(data: CreateKeyToken) {
    try {
      await this.prismaService.keyToken.upsert({
        where: {
          shopId: data.shopId,
        },
        create: data,
        update: data,
      });
    } catch (error) {
      throw new HttpException('Create key token fail', 500);
    }
  }

  async generateTokenPair(data: IGenerateTokenPair) {
    const { payload, keyAccess, keyRefresh } = data;
    const accessToken = jwt.sign(payload, keyAccess, {
      expiresIn: '2h',
    });
    const refreshToken = jwt.sign(payload, keyRefresh, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async generateTokenVerifyEmail(data: IGenTokenVerifyEmail) {
    const { key, payload } = data;
    return jwt.sign(payload, key, { expiresIn: '2h' })
  }

  async removeKeyByShopId(shopId: string) {
    try {
      await this.prismaService.keyToken.delete({
        where: {
          shopId,
        },
      });
      return { message: "Logout successfully" }
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
