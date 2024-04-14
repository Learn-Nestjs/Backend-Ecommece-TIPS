import { Module } from '@nestjs/common';
import { KeyToken } from './key-token';

@Module({
  providers: [KeyToken],
  exports: [KeyToken]
})
export class KeyTokenModule {}
