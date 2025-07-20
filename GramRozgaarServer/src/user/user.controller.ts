import { Body, Controller, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { BadRequestException } from "@nestjs/common";
import { UserInfoDto } from "./dto/user-info.dto";
import { JwtAuthGuard } from "./strateges/jwt.guard";
import { RequestWithUser } from "src/types/RequestWithUser";
import { UploadedFiles } from "@nestjs/common";


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
    @UseInterceptors(FilesInterceptor('machineImage', 5, {
        storage: diskStorage({
            destination: './uploads/machineImg',
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '-' + file.originalname;
                cb(null, uniqueName);
            }
        })
    }))
    async userInfo(
        @UploadedFiles() file: Express.Multer.File[],
        @Body() userInfoDto: UserInfoDto,
        @Req() req: RequestWithUser
    ) {
        if (!userInfoDto) {
            throw new BadRequestException('User data has not been provided');
        }

        const userId = Number(req.user.sub);
        const machineImages = file.map((file) => file.filename);
        const result = await this.userService.userInfo(userId, userInfoDto, machineImages);
        return {
            message: result.message,
            info: {
                ...result.info,
                userId: result.info.userId.toString(),
            },
        };
    }

    //get user profile
    @Get('user-profile')
    async userProfile(
        @Query('phoneNumber') phoneNumber: string
    ) {
        return this.userService.userProfile(phoneNumber);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user-info')
    async getUserInfo(@Req() req: RequestWithUser) {
        const userId = Number(req.user.sub);
        return this.userService.getUserInfo(userId);
    }
};