import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';

export class UserService {
    constructor(private prisma: PrismaService) {
    }

    //sign up function
    async signup(data: any) {
        const { phoneNumber, password, confirmPassword } = data;

        if (!password || !phoneNumber || !confirmPassword) {
            throw new NotFoundException('Credentials is required');
        }

        const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });
        if (existingUser) {
            throw new BadRequestException('User already exists!');
        }

        if (password != confirmPassword) throw new BadRequestException('Password do not match.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return { message: 'Signup successful !', user };
    }

    //sign in function
    async signin(phoneNumber: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { phoneNumber } });

        if (!user) {
            throw new NotFoundException('User not Found, Please enter correct credentials!');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new BadRequestException('Password do not match!');

        return { message: 'Login successful!', user };
    }
}