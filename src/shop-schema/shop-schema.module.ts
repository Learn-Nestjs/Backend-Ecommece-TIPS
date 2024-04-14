import { Module } from '@nestjs/common';
import { shopSchemaService } from './shop-schema';
import { ShopSchemaController } from './shop-schema.controller';
import { KeyToken } from 'src/key-token/key-token';
import { KeyTokenModule } from 'src/key-token/key-token.module';

@Module({
  providers: [shopSchemaService],
  controllers: [ShopSchemaController],
  imports: [KeyTokenModule]

})
export class ShopSchemaModule {}
