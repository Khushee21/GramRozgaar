import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

export class UserInfoDto {


    @IsString()
    workType: string

    @IsBoolean()
    isMachineAvailable: boolean

    @IsBoolean()
    isAvailableForWork: boolean

    @IsString()
    machineType: string

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    machineImages: string
}