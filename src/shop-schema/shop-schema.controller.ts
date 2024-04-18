import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { shopSchemaService } from './shop-schema';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('shop-schema')
@Controller('shop-schema')
export class ShopSchemaController {
  constructor(private shopSchemaService: shopSchemaService) {}
}
