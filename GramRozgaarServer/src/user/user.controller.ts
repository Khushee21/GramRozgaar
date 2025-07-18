import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { BadRequestException } from "@nestjs/common";
import { UserInfoDto } from "./dto/user-info.dto";

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
        return this.userService.signin(phoneNumber, password);
    }

    @Post('userInfo')
    @UseInterceptors(FileInterceptor('machineImage', {
        storage: diskStorage({
            destination: './uploads/machineImg',
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '-' + file.originalname;
                cb(null, uniqueName);
            }
        })
    }))
    async userInfo(
        @UploadedFile() file: Express.Multer.File,
        @Body() userInfoDto: UserInfoDto
    ) {
        if (!userInfoDto) {
            throw new BadRequestException('user data has not provided');
        }

        // 🔹 Validate userId
        if (!userInfoDto.userId) {
            throw new BadRequestException('userId is missing in body');
        }

        const userId = userInfoDto.userId;
        const machineImages = [file.filename]; // if you expect multiple images, change `@UploadedFile` to `@UploadedFiles`

        // You may choose to remove userId from the DTO before passing it
        const { userId: _, ...restDto } = userInfoDto;

        return this.userService.userInfo(userId, restDto, machineImages);
    }

}