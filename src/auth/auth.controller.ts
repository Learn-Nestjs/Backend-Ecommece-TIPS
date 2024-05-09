import { Body, Controller, Get, Headers, HttpCode, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { SignUpDto, SingInDto, VerifyEmailDto } from './dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators';
import { GoogleOAuthGuard } from './AuthGuard/google.authGuard';
import { ProviderAuth } from '@prisma/client';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ) {}

    @Public()
    @Get('/google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Request() req) {}

    @Public()
    @Get('/google-redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Request() req) {
      const {email, firstName, lastName, picture} = req.user as {email: string, firstName? : string, lastName ? : string, picture: string};
      const data = {email: email, name: (firstName || "") + (lastName || "" ), avatar: picture, provider: ProviderAuth.GOOGLE}
      return this.authService.singInWithThirdParty(data)
    }

    @Public()
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
    async logout(@Req() req) {
        const {id} = req.shop as {id: string}
        return await this.authService.logout(id)
    }

    @Post('/refresh-token')
    @HttpCode(200)
    @ApiOkResponse({status: 200, description: "Logout successfull" })
    async refreshToken(@Req() req, @Headers('authorization') authorization : string){
        const shop = req.shop as {id: string, email: string};
        const refreshToken = authorization.split(' ')[1];
        return await this.authService.refreshToken(shop, refreshToken)
    }

    @Public()
    @Post('/verify-email')
    @ApiOkResponse({status: 200, description: "Verify success" })
    @HttpCode(200)
    async verifyOrResendEmail(@Body() verifyEmailDto : VerifyEmailDto) {
        return await this.authService.verifyOrResendEmail(verifyEmailDto)
    }
}
