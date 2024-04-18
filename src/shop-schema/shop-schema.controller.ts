import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SignUpDto, SingInDto } from './dto';
import { shopSchemaService } from './shop-schema';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('shop-schema')
@Controller('shop-schema')
export class ShopSchemaController {
    constructor(private shopSchemaService: shopSchemaService ) {}

    @Post('sign-up')
    @ApiOkResponse({status: 201, description: "Create shop successfull" })
    async signUp(@Body() signUpDto : SignUpDto) {
        return await this.shopSchemaService.signUp(signUpDto)
    }

    @Post('sign-in')
    @ApiOkResponse({status: 200, description: "Login successfull" })
    async signIn(@Body() signInDto : SingInDto) {
        return await this.shopSchemaService.signIn(signInDto)
    }
}
