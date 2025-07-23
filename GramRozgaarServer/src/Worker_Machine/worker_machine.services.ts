import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthServices } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class Worker_machineServices {
    constructor(
        private prisma: PrismaService,
        private authService: AuthServices
    ) { }

    async getAllWorker(userId: number) {
        const userWithMachines = await this.prisma.userInfo.findMany({
            where: {
                isMachineAvailable: true,
                machineType: {
                    not: "",           // Exclude empty strings
                },
                userId: {
                    not: userId,
                },
            },
            select: {
                userId: true,
                name: true,
                isMachineAvailable: true,
                workType: true,
                machineType: true,
                machineImages: true,
                user: {
                    select: {
                        phoneNumber: true,
                        profileImage: true,
                    },
                },
            },
        });

        if (!userWithMachines || userWithMachines.length === 0) {
            throw new NotFoundException("No other workers with available machines found");
        }

        const filteredResult = userWithMachines.map((user) => {
            const { machineImages, ...rest } = user;
            return machineImages && machineImages.length > 0 ? { ...rest, machineImages } : rest;
        });

        return filteredResult;
    }
}