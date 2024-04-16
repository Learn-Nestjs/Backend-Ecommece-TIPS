import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateKeyToken, IGenerateTokenPair } from './interfaces';
import  * as jwt from 'jsonwebtoken';

@Injectable()
export class KeyToken {
  constructor(private prismaService: PrismaService) {}
  async createKeyToken(data: CreateKeyToken) {
    try {
      await this.prismaService.keyToken.upsert({
        where: {
          shopId: data.shopId
        },
        create: data,
        update: data
      })
    } catch (error) {
      console.log('error :', error)
      throw new HttpException('Create key token fail', 500);
    }
  }

  async generateTokenPair(data: IGenerateTokenPair) {

    const {payload, keyAccess, keyRefresh} = data;
    const accessToken = jwt.sign(payload, keyAccess, {
      expiresIn: "2h"
    });
    const refreshToken = jwt.sign(payload, keyRefresh, {
      expiresIn: "7d"
    });

    return {accessToken, refreshToken}
  }

}
