import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { KeyToken } from 'src/key-token/key-token';
import { getObjectWithKey } from 'src/common/libs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ServerError } from 'src/common/exception';
@Injectable()
export class shopSchemaService {
  constructor(
    private prismaService: PrismaService,
    private keyToken: KeyToken,
  ) {}
}
