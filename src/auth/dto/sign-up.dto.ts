import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {PickType} from '@nestjs/mapped-types'
export class SignUpDto {
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  }

export class SingInDto extends PickType(SignUpDto, ['email', 'password']){}