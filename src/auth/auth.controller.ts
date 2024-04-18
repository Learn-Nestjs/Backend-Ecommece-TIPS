import { Body, Controller, Get, Header, HttpCode, Post, Res } from '@nestjs/common';
import { SignUpDto, SingInDto } from './dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ) {}

    @Post('/shop/sign-up')
    @ApiOkResponse({status: 201, description: "Create shop successfull" })
    async signUp(@Body() signUpDto : SignUpDto) {
        return await this.authService.signUp(signUpDto)
    }

    @Post('/shop/sign-in')
    @ApiOkResponse({status: 200, description: "Login successfull" })
    @HttpCode(200)
    async signIn(@Body() signInDto : SingInDto) {
        return await this.authService.signIn(signInDto)
    }

    @Post('/shop/logout')
    @HttpCode(200)
    @ApiOkResponse({status: 200, description: "Logout successfull" })
    async logout(@Body() signInDto : SingInDto) {
        return await this.authService.signIn(signInDto)
    }
}
