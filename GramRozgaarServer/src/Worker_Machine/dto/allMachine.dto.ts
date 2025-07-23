import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class AllMachineDto {
    @IsNotEmpty()
    @IsString()
    senderName: string;

    @IsNotEmpty()
    @IsString()
    receiverName: string;

    @IsOptional()
    @IsString()
    confirmedAt?: string;

    @IsBoolean()
    confirmMachine: boolean;

}
