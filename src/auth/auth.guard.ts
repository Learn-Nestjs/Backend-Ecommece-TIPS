import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const { id: shopId, email } = jwt.decode(token) as {
        id: string;
        email: string;
      };
      if (!shopId) throw new UnauthorizedException();

      const keyToken = await this.prismaService.keyToken.findFirst({
        where: {
          shopId,
        },
      });

      if(!keyToken) throw new UnauthorizedException("Key token not found");

      const  payload = jwt.verify(token, keyToken.keyAccess)
      request['shop'] = payload
    
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
