import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    //sign up function
    async signup(data: any) {
        try {
            const { village, phoneNumber, password, confirmPassword, age, profileImage, name } = data;

            console.log('🛠 Incoming signup data:', data);

            if (!village || !password || !phoneNumber || !confirmPassword || !age || !profileImage || !name) {
                console.log('❌ Missing field(s)', { village, phoneNumber, password, confirmPassword, age, profileImage, name });
                throw new NotFoundException('Credentials are required');
            }

            const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });
            if (existingUser) {
                console.log('⚠️ User already exists');
                throw new BadRequestException('User already exists!');
            }

            if (password !== confirmPassword) {
                console.log('❌ Passwords do not match');
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
                console.log('✅ User created:', user);
            } catch (err) {
                console.error('❌ Prisma create failed:', err);
                throw new BadRequestException('Database error: ' + err.message);
            }
            console.log('✅ User created:', user);
            return { message: 'Signup successful!', user };
        } catch (err) {
            console.error('❌ Error in signup:', err);
            throw err;
        }
    }


    //sign in function
    async signin(phoneNumber: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
        console.log(user);
        if (!user) {
            throw new NotFoundException('User not Found, Please enter correct credentials!');
        }
        const match = await bcrypt.compare(password, user.password);
        console.log(match);
        if (!match) throw new BadRequestException('Password do not match!');

        return { message: 'Login successful!', user };
    }
}