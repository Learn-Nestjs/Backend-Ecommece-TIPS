import { Module } from '@nestjs/common';
import { shopSchemaService } from './shop-schema';
import { ShopSchemaController } from './shop-schema.controller';

@Module({
  providers: [shopSchemaService],
  controllers: [ShopSchemaController]
})
export class ShopSchemaModule {}
