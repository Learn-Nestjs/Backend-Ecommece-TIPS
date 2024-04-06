import { Module } from '@nestjs/common';
import { GoogleAuth } from './google-auth';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  providers: [GoogleAuth],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}
