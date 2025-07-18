//getToken
//sign token
//update refresh token
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthServices {
    constructor(private prisma: PrismaService) { }

    async getTokens(userId: number, phoneNumber: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken(userId, phoneNumber, process.env.AT_SECRET!, '15m'),
            this.signToken(userId, phoneNumber, process.env.RT_SECRET!, '7d'),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async signToken(
        userId: number,
        phoneNumber: string,
        secret: string,
        expiresIn: string,
    ): Promise<string> {
        const payload = { sub: userId, phoneNumber };
        return jwt.sign(payload, secret, { expiresIn });
    }

    //Update RefreshToken
    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedPassword = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedPassword },
        });
    }

    //logout
    async logout(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    async validateRefreshToken(userId: number, token: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const matches = await bcrypt.compare(token, user.refreshToken);
        if (!matches) {
            throw new ForbiddenException('Invalid Token');
        }
        return user;
    }
}