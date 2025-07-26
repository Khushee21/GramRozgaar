import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LocationService {
    constructor(private prisma: PrismaService) { }

    async updateLocation(userId: number, latitude: number, longitude: number) {
        return this.prisma.location.upsert({
            where: { userId },
            update: { latitude, longitude },
            create: { userId, latitude, longitude },
        });
    }

    async gelAllUserLocations() {
        return this.prisma.location.findMany({
            include: { user: true },
        });
    }

    async getLocationByUserId(userId: number) {
        return this.prisma.location.findUnique({
            where: { userId },
        })
    }

}