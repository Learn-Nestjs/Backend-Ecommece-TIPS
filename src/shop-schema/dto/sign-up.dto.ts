import { IsEmail, IsNotEmpty } from 'class-validator';
export class SignUpDto {
    
    name: string;
  
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
  }