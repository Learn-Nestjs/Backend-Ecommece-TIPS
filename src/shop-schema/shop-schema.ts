import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignIn, ISignUp } from './interfaces/shop.interface';
import { KeyToken } from 'src/key-token/key-token';
import { getObjectWithKey } from 'src/common/libs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt'
import { ServerError } from 'src/common/exception';
@Injectable()
export class shopSchemaService {
  constructor(
    private prismaService: PrismaService,
    private keyToken: KeyToken,
  ) {}

  async signUp(data: ISignUp) {
    const holderShop = await this.prismaService.shopSchema.findFirst({
      where: {
        email: data.email,
      },
    });

    if (holderShop) throw new ConflictException('Email has existin');

    const hashPassWork = await bcrypt.hash(data.password, 10);

    const shop = await this.prismaService.shopSchema.create({
      data: {
        ...data,
        password: hashPassWork
      }
    });

    if(!shop) throw new ServerError('Create shop fail')

    const keyAccess = await crypto.randomBytes(64).toString('hex');
    const keyRefresh = await crypto.randomBytes(64).toString('hex');

    const keyToken = await this.keyToken.createKeyToken({
      shopId: shop.id,
      keyAccess,
      keyRefresh,
    });
    const {accessToken, refreshToken} =  await this.keyToken.generateTokenPair({
      payload: { id: shop.id, email: shop.email },
      keyAccess: keyToken.keyAccess,
      keyRefresh: keyToken.keyRefresh,
    });

    const shopData = getObjectWithKey(shop, ["id", "email"])
    return {
      shop: shopData,
      accessToken,
      refreshToken
    }
  }

  async signIn(data: ISignIn) {
    const shop = await this.prismaService.shopSchema.findUnique({where: {email: data.email}})
    if(!shop) throw new NotFoundException();
    const match = await bcrypt.compare(data.password, shop.password)
    if(!match) throw new NotFoundException('Your password or Email is incorrect')
    
  }
}
