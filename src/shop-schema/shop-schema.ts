import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignUp } from './interfaces/shop.interface';

@Injectable()
export class shopSchemaService {
    constructor(private prismaService: PrismaService){}

    async signUp (data : ISignUp) {
        const holderShop = await this.prismaService.shopSchema.findFirst({
            where: {
                email: data.email
            }
        })

        if(holderShop) throw new ConflictException("Email has existin")
        const test = await this.prismaService.shopSchema.create({data})        
        console.log('test :', test);
    }

}
