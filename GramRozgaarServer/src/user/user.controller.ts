import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { BadRequestException } from "@nestjs/common";
import { UserInfoDto } from "./dto/user-info.dto";
import { JwtAuthGuard } from "./strateges/jwt.guard";
import { RequestWithUser } from "src/types/RequestWithUser";

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

    @UseGuards(JwtAuthGuard)
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
        @Body() userInfoDto: UserInfoDto,
        @Req() req: RequestWithUser
    ) {
        if (!userInfoDto) {
            throw new BadRequestException('User data has not been provided');
        }

        const userId = (req.user.sub);
        const machineImages = file ? [file.filename] : [];
        const result = await this.userService.userInfo(userId, userInfoDto, machineImages);
        return {
            message: result.message,
            info: {
                ...result.info,
                userId: result.info.userId.toString(),
            },
        };
    }
};