import { IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDto {
    @IsPhoneNumber('IN')
    phoneNumber: string;

    @IsString()
    password: string;
}