import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { IHeaderFields } from '../interfaces';
import { Forbidden } from '../exception';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const headerFields = this.configService.get<IHeaderFields>('headerFields')
    const key = req.header(headerFields.X_API_KEY)
    // kiểm tra xem rằng trong req gửi lên có chứa key thỏa mãn để truy cập vào hệ thống hay không
    if(!key) throw new Forbidden("Access denied, Your api key is not correct")
    const checkApiKey = await this.prismaService.apiKey.findFirst({
      where: {
        key,
        status: true
      }
    })
    if(!checkApiKey) throw new Forbidden("Access denied, Your api key is not correct")
    next();
    // check permission để sau
  }
}
