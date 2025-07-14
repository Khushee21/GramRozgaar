import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsInt, Min, Max, isString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    village: string;

    @IsPhoneNumber('IN')
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    @IsInt()
    @Min(10)
    @Max(100)
    age: number;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    languagePrefrence?: 'en' | 'hi';
}