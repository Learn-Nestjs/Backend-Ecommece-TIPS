import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService, private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const header = this.configService.get('headerFields')
    console.log('header :', header)
    next();
  }
}
