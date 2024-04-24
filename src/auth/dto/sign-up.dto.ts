import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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