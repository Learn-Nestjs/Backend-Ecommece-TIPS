import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignUp } from './interfaces/shop.interface';
import * as crypto from 'crypto'
@Injectable()
export class shopSchemaService {
    constructor(private prismaService: PrismaService) { }

    async signUp(data: ISignUp) {
        const holderShop = await this.prismaService.shopSchema.findFirst({
            where: {
                email: data.email
            }
        })

        // if (holderShop) throw new ConflictException("Email has existin")
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "pkcs1",
                format: 'pem'
            },
            privateKeyEncoding: {
                type: "pkcs1",
                format: 'pem'
            }
        })
        // const test = await this.prismaService.shopSchema.create({data})        
    }

}
