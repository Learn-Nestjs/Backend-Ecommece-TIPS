import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignIn, ISignInWithThirdParty, ISignUp, IVerifyOrResendEmail } from './interfaces/shop.interface';
import { KeyToken } from 'src/key-token/key-token';
import { getObjectWithKey } from 'src/common/libs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { CustomeError, Forbidden, ServerError } from 'src/common/exception';
import { MailService } from 'src/mail-service/mail-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private keyToken: KeyToken,
    private mailService: MailService,
    private readonly configService: ConfigService
  ) { }

  async signUp(data: ISignUp) {
    try {
      const holderShop = await this.prismaService.shopSchema.findFirst({
        where: {
          email: data.email,
        },
      });

      if (holderShop) throw new ConflictException('Email has existin');

      const shop = await this.prismaService.shopSchema.create({
        data : { ...data, password: await bcrypt.hash(data.password, 10) }
      });

      if (!shop) throw new ServerError('Create shop fail')
      
      // có thể bỏ await để tránh việc chờ gửi mail.
      this.mailService.sendMailToVerifyEmail({
          to: data.email, templateData: {
            name: data.name
          }
      })

      const shopData = getObjectWithKey(shop, ["id", "email", "verify"])
      return {
        shop: shopData,
      }

    } catch (error) {
      throw new CustomeError(error.message || 'Sign Up Fail', error.code || 500);
    }
  }

  async signIn(data: ISignIn) {
    try {
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
    } catch (error) {
      throw new CustomeError(error.message || 'Some thing went wrong, please login again!', error.code || 500);
    }
  }

  async singInWithThirdParty(data : ISignInWithThirdParty) {
    try {
      const holderShop = await this.prismaService.shopSchema.findFirst({
        where: {
          email: data.email,
        },
      });

      if (holderShop) throw new ConflictException('Email has existin');

      const shop = await this.prismaService.shopSchema.create({
        data
      });

      if (!shop) throw new ServerError('Create shop fail')

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

      const shopData = getObjectWithKey(shop, ["id", "email", "verify"])
      return {
        shop: shopData,
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw new CustomeError(error.message || `Login with ${data.provider.toLowerCase()} fail`, error.code || 500);      
    }
  }

  async logout(shopId: string) {
    try {
      return await this.keyToken.removeKeyByShopId(shopId)
    } catch (error) {
      throw new CustomeError(error.message || "Something went wrong!", error.code || 500);      
    }
  }

  async refreshToken(shop: { id: string, email: string }, curentToken: string) {
    try {
      const keyToken = await this.prismaService.keyToken.findFirst({
        where: { shopId: shop.id }
      })

      // Không cần check xem keyToken có tồn tại ko nữa vì chắc chắn có nếu đi qua được auth.guard
      // Check xem refreshToken này đã dùng chưa, và có là refresh-token hiện tại ko
      if (keyToken.refreshTokensUsed.includes(curentToken) && keyToken.refreshToken !== curentToken) {
        // xóa keyToken
        await this.prismaService.keyToken.delete({ where: { id: keyToken.id } })
        throw new Forbidden("Something went wrong, let's re-login")
      }

      const { accessToken, refreshToken } = await this.keyToken.generateTokenPair({
        payload: { id: shop.id, email: shop.email },
        keyAccess: keyToken.keyAccess,
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
    } catch (error) {
      throw new CustomeError(error.message || "Refresh Token Fail!", error.code || 500);      
    }
  }

  async verifyOrResendEmail(data: IVerifyOrResendEmail) {
    try {
      const {token, resend, userId} = data;
      const secretHash = this.configService.get<string>('SECRET_HASH')
      if(resend) {
        // resend an email to verify
        const {email, verify, name} = await this.prismaService.shopSchema.findUnique({where: {id: userId}})
        if(verify) return {message: "The account is verified"}
        await this.mailService.sendMailToVerifyEmail({to: email, templateData: {name: name}})
        return;
      }
      // verify email
      try {
        const {email} = jwt.verify(token, secretHash) as {email: string}
        await this.prismaService.shopSchema.update({where:{email}, data: {verify: true}})
      } catch (error) {
        throw new UnauthorizedException("Token expired or wrong")
      }
    } catch (error) {
      throw new CustomeError(error.message || 'Verify email is fail', error.code || 500);
    }
  }
}
