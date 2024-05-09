import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, isBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {PickType} from '@nestjs/mapped-types'
import { ProviderAuth } from '@prisma/client';
export class SignUpDto {
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsOptional()
    password: string;

    @IsOptional()
    provider: ProviderAuth

    @IsOptional()
    avatar: string
  }

export class SingInDto extends PickType(SignUpDto, ['email', 'password']){}

export class VerifyEmailDto {
  @IsString()
  token: string
  
  @IsOptional()
  @IsBoolean()
  resend: boolean

  @IsOptional()
  @IsString()
  shopId: string
}