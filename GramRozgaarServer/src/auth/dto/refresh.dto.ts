// dto/refresh.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RefreshDto {
    @IsNumber()
    userId: number;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
