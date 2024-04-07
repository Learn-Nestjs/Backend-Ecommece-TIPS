import { Module } from '@nestjs/common';
import { ShopSchema } from './shop-schema';
import { ShopSchemaController } from './shop-schema.controller';

@Module({
  providers: [ShopSchema],
  controllers: [ShopSchemaController]
})
export class ShopSchemaModule {}
