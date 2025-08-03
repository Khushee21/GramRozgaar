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
            console.log('Received User Info Payload:', {
                userId,
                workType,
                isAvailableForWork,
                isMachineAvailable,
                machineType,
                machineImages,
            });

            if (!userId) {
                throw new NotFoundException("User not found");
            }

            if (!workType || typeof isAvailableForWork !== 'boolean' || typeof isMachineAvailable !== 'boolean') {
                throw new NotFoundException('User Information is required!');
            }

            const user = await this.prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { name: true },
            });

            if (!user || !user.name) {
                throw new NotFoundException("User not found or name is missing.");
            }

            // Check if UserInfo already exists for this user
            const existingUserInfo = await this.prisma.userInfo.findUnique({
                where: { userId: Number(userId) },
            });

            if (existingUserInfo) {
                const updatedInfo = await this.prisma.userInfo.update({
                    where: { userId: Number(userId) },
                    data: {
                        workType,
                        isAvailableForWork,
                        isMachineAvailable,
                        machineType,
                        machineImages,
                    },
                });
                return {
                    message: 'User Info updated successfully',
                    info: updatedInfo,
                };
            }

            // Create new UserInfo
            const info = await this.prisma.userInfo.create({
                data: {
                    userId: Number(userId),
                    name: user.name,
                    workType,
                    isAvailableForWork,
                    isMachineAvailable,
                    machineType,
                    machineImages,
                },
            });

            return {
                message: 'User Info saved successfully',
                info,
            };

        } catch (err: any) {
            throw new InternalServerErrorException(err.message);
        }
    }


    //get profile 
    async userProfile(phoneNumber: string) {
        if (!phoneNumber) {
            throw new BadRequestException('Phone number is required');
        }

        const user = await this.prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            throw new NotFoundException('User not found or phone number mismatch');
        }

        return {
            name: user.name,
            phoneNumber: user.phoneNumber,
            age: user.age,
            village: user.village,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        };
    }

    //get user -profile
    async getUserInfo(userId: number) {
        // console.log("Fetching userInfo for:", userId);

        const userInfo = await this.prisma.userInfo.findMany({
            where: { userId },
        });

        if (userInfo.length === 0) {
            //  console.log("No userInfo found for this userId.");
        } else {
            // console.log("Found userInfo:", userInfo);
        }

        return userInfo;
    }


    //update user profile
    async updateUserProfile(userId: number, data: any, machineImages: Express.Multer.File[]) {
        if (!userId) {
            throw new NotFoundException('User id not found!');
        }

        const user = await this.prisma.userInfo.findUnique({
            where: { userId: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        const updatedUser = await this.prisma.userInfo.update({
            where: {
                userId: userId
            },
            data: {
                workType: data.workType,
                isAvailableForWork: data.isAvailableForWork === 'true' || data.isAvailableForWork === true,
                isMachineAvailable: data.isMachineAvailable === 'true' || data.isMachineAvailable === true,
                machineType: data.machineType,
                machineImages: machineImages?.map(file => file.filename) || [],
            },
        });

        return { message: 'User profile updated successfully.', updatedUser };
    }
}