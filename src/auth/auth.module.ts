import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeyTokenModule } from 'src/key-token/key-token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [KeyTokenModule]

})
export class AuthModule {}
