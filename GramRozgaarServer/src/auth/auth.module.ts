import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthServices } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default_secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [UserController],
    providers: [AuthServices, UserService],
    exports: [AuthServices],
})
export class AuthModule { }
