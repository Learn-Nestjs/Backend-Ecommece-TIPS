import { Module } from '@nestjs/common';
import { KeyToken } from './key-token';

@Module({
  providers: [KeyToken]
})
export class KeyTokenModule {}
