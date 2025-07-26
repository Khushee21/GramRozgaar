import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LocationGateway } from "./location.gateway";

@Injectable()
export class LocationService {
    constructor(
        private prisma: PrismaService,

        @Inject(forwardRef(() => LocationGateway))
        private locationGateway: LocationGateway,
    ) { }

    async updateLocation(userId: number, latitude: number, longitude: number) {
        const location = await this.prisma.location.upsert({
            where: { userId },
            update: { latitude, longitude },
            create: { userId, latitude, longitude },
        });

        await this.locationGateway.broadcastLocationUpdate();
        return location;
    }

    async getAllUserLocations() {
        return this.prisma.location.findMany({
            include: { user: true },
        });
    }

    async getLocationByUserId(userId: number) {
        return this.prisma.location.findUnique({
            where: { userId },
        });
    }
}
