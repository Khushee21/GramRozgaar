import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.userService.signup(createUserDto);
    }

    @Post('signin')
    async signin(@Body() loginUser: LoginUserDto) {
        const { phoneNumber, password } = loginUser;
        return this.userService.signin(phoneNumber, password);
    }
}