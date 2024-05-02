import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignIn, ISignUp } from './interfaces/shop.interface';
import { KeyToken } from 'src/key-token/key-token';
import { getObjectWithKey } from 'src/common/libs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt'
import { Forbidden, ServerError } from 'src/common/exception';
import { MailService } from 'src/mail-service/mail-service';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private keyToken: KeyToken,
        private mailService : MailService
      ) { }
    
      async signUp(data: ISignUp) {
        const holderShop = await this.prismaService.shopSchema.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (holderShop) throw new ConflictException('Email has existin');

        const dataCreated = data.provider ? data : {...data, password: await bcrypt.hash(data.password, 10)}
        const shop = await this.prismaService.shopSchema.create({
          data: dataCreated
        });
    
        if (!shop) throw new ServerError('Create shop fail')
    
        const keyAccess = await crypto.randomBytes(64).toString('hex');
        const keyRefresh = await crypto.randomBytes(64).toString('hex');
    
        const { accessToken, refreshToken } = await this.keyToken.generateTokenPair({
          payload: { id: shop.id, email: shop.email },
          keyAccess,
          keyRefresh
        });

        if(!data.provider) {
          await this.mailService.sendMailToVerifyEmail({to:data.email, templateData: {
            name: data.name
          }, token: keyAccess})
        }
    
        await this.keyToken.createKeyToken({
          shopId: shop.id,
          keyAccess,
          keyRefresh,
          refreshToken
        });
    
    
        const shopData = getObjectWithKey(shop, ["id", "email", "verify"])
        return {
          shop: shopData,
          accessToken,
          refreshToken
        }
      }
    
      async signIn(data: ISignIn) {
        const shop = await this.prismaService.shopSchema.findUnique({ where: { email: data.email } })
        if (!shop) throw new NotFoundException();
        const match = await bcrypt.compare(data.password, shop.password)
        if (!match) throw new NotFoundException('Your password or Email is incorrect')
    
        const keyAccess = await crypto.randomBytes(64).toString('hex');
        const keyRefresh = await crypto.randomBytes(64).toString('hex');
    
        const { accessToken, refreshToken } = await this.keyToken.generateTokenPair({
          payload: { id: shop.id, email: shop.email },
          keyAccess,
          keyRefresh
        });
    
        await this.keyToken.createKeyToken({
          shopId: shop.id,
          keyAccess,
          keyRefresh,
          refreshToken
        });

        return {
          shop: getObjectWithKey(shop, ['name', "email", "verify"]),
          accessToken,
          refreshToken
        }
      }

      async logout(shopId: string) {
        return await this.keyToken.removeKeyByShopId(shopId)
      }

      async refreshToken(shop: {id: string, email: string} , curentToken: string) {
        const keyToken = await this.prismaService.keyToken.findFirst({
          where: {shopId: shop.id}
        })

        // Không cần check xem keyToken có tồn tại ko nữa vì chắc chắn có nếu đi qua được auth.guard
        // Check xem refreshToken này đã dùng chưa, và có là refresh-token hiện tại ko
        if(keyToken.refreshTokensUsed.includes(curentToken) && keyToken.refreshToken !== curentToken) {
          // xóa keyToken
          await this.prismaService.keyToken.delete({where: {id: keyToken.id}})
          throw new Forbidden("Something went wrong, let's re-login")
        }
        
        const { accessToken, refreshToken } = await this.keyToken.generateTokenPair({
            payload: { id: shop.id, email: shop.email },
            keyAccess: keyToken.keyAccess ,
            keyRefresh: keyToken.keyRefresh
          });
          
          // cập nhật lại keyToken
          await this.prismaService.keyToken.update({
            where: {
              id: keyToken.id
            },
            data: {
              refreshToken,
              refreshTokensUsed: [...keyToken.refreshTokensUsed, curentToken]
            }
          })
          
          return {
            shop,
            accessToken,
            refreshToken
          }
        }

}
