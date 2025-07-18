import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { BadRequestException } from "@nestjs/common";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    @UseInterceptors(FileInterceptor('profileImage', {
        storage: diskStorage({
            destination: './uploads/',
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '-' + file.originalname;
                cb(null, uniqueName);
            }
        })
    }))
    async signup(
        @UploadedFile() file: Express.Multer.File,
        @Body() createUserDto: CreateUserDto
    ) {
        if (!file) {
            throw new BadRequestException('Profile image is required');
        }

        if (!createUserDto) {
            throw new BadRequestException('User data not provided');
        }

        createUserDto.profileImage = file?.filename;
        const result = await this.userService.signup(createUserDto);
        // console.log('📦 Returned from service:', result);
        if (!result || !result.user) {
            throw new BadRequestException('Something went wrong');
        }
        return {
            success: true,
            message: result.message,
            user: result.user,
            tokens: result.tokens,
        };

    }


    @Post('signin')
    async signin(@Body() loginUser: LoginUserDto) {
        const { phoneNumber, password } = loginUser;
        console.log(phoneNumber, password);
        return this.userService.signin(phoneNumber, password);
    }
}