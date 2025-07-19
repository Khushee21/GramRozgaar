import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthServices } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default_secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthServices, UserService],
    exports: [AuthServices],
})
export class AuthModule { }
