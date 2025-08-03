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
        try {

            const location = await this.prisma.location.upsert({
                where: { id: userId },
                update: { latitude, longitude },
                create: { userId, latitude, longitude },

            });


            await this.locationGateway.broadcastLocationUpdate();
            return location;
        } catch (error) {

            throw error;
        }
    }


    async getAllUserLocations() {
        return this.prisma.location.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });
    }
    async getLocationByUserId(userId: number) {
        return this.prisma.location.findUnique({
            where: { userId },
        });
    }
}
