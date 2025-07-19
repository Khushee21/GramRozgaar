import { BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { AuthServices } from "src/auth/auth.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,
        private authService: AuthServices,
    ) {
    }

    //sign up function
    async signup(data: any) {
        try {
            const { village, phoneNumber, password, confirmPassword, age, profileImage, name } = data;
            if (!village || !password || !phoneNumber || !confirmPassword || !age || !profileImage || !name) {
                throw new NotFoundException('Credentials are required');
            }

            const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });
            if (existingUser) {
                throw new BadRequestException('User already exists!');
            }

            if (password !== confirmPassword) {
                throw new BadRequestException('Passwords do not match.');
            }
            console.log('again signup data:', data);
            const hashedPassword = await bcrypt.hash(password, 10);
            let user;
            try {
                user = await this.prisma.user.create({
                    data: {
                        name,
                        village,
                        phoneNumber,
                        password: hashedPassword,
                        age: Number(age),
                        profileImage,
                    },
                });
                const token = await this.authService.getTokens(user.id, phoneNumber);
                await this.authService.updateRefreshToken(user.id, token.refreshToken);

                return { message: 'Signup successful!', user, tokens: token };
            } catch (err) {
                throw new BadRequestException('Database error: ' + err.message);
            }
        } catch (err) {
            throw err;
        }
    }


    //sign in function
    async signin(phoneNumber: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
        if (!user) {
            throw new NotFoundException('User not Found, Please enter correct credentials!');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new BadRequestException('Password do not match!');

        const tokens = await this.authService.getTokens(user.id, phoneNumber);
        await this.authService.updateRefreshToken(user.id, tokens.refreshToken
        );

        return { message: 'Login successful!', user, tokens };
    }

    //userInfo function
    async userInfo(userId: number, data: any, machineImages: string[]) {
        try {
            const { workType, isMachineAvailable, isAvailableForWork, machineType } = data;

            console.log(workType, isMachineAvailable, isAvailableForWork, machineType);

            if (!workType || typeof isAvailableForWork !== 'boolean' || typeof isMachineAvailable !== 'boolean') {
                throw new NotFoundException('User Information is required!');
            }

            // if (isMachineAvailable && !machineType) {
            //     throw new NotFoundException('Machine type is required if machine is available');
            // }

            const existingInfo = await this.prisma.userInfo.findUnique({
                where: { userId: Number(userId) }, // userId is a string
            });

            if (existingInfo && existingInfo.machineAlreadySet) {
                throw new BadRequestException('User info already set');
            }

            const info = await this.prisma.userInfo.create({
                data: {
                    userId: Number(userId),
                    workType,
                    isAvailableForWork: Boolean(isAvailableForWork),
                    isMachineAvailable: Boolean(isMachineAvailable),
                    machineType,
                    machineImages,
                },
            });

            console.log('User info created:', info);

            return {
                message: 'User Info saved successfully',
                info,
            };
        } catch (err: any) {
            throw new InternalServerErrorException(err.message);
        }
    }

}