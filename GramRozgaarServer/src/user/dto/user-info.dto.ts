import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

export class UserInfoDto {

    @IsString()
    userId: string;

    @IsString()
    workType: string

    @IsBoolean()
    isMachineAvailable: boolean

    @IsBoolean()
    isAvailableForWork: boolean

    @IsString()
    machineType: string

    @IsOptional()
    @IsString()
    @IsArray()
    machineImages: string
}