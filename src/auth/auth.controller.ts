import { Body, Controller, Get, Header, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { SignUpDto, SingInDto } from './dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/common/decorators';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ) {}

    @Post('/sign-up')
    @ApiOkResponse({status: 201, description: "Create shop successfull" })
    async signUp(@Body() signUpDto : SignUpDto) {
        return await this.authService.signUp(signUpDto)
    }

    @Public()
    @Post('/sign-in')
    @ApiOkResponse({status: 200, description: "Login successfull" })
    @HttpCode(200)
    async signIn(@Body() signInDto : SingInDto) {
        return await this.authService.signIn(signInDto)
    }

    @Post('/logout')
    @HttpCode(200)
    @ApiOkResponse({status: 200, description: "Logout successfull" })
    async logout(@Body() signInDto : SingInDto) {
        return await this.authService.logout(signInDto)
    }
}
