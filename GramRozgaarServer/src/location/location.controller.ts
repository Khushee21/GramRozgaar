// location.controller.ts
import { Body, Controller, Get, Post, Param } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationGateway } from "./location.gateway";
import { WebSocketGateway } from "@nestjs/websockets";

@Controller('location')
@WebSocketGateway()
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly locationGateway: LocationGateway
    ) { }

    @Post()
    async updateLocation(@Body() body: { userId: number, latitude: number, longitude: number }) {
        const updated = await this.locationService.updateLocation(body.userId, body.latitude, body.longitude);
        await this.locationGateway.broadcastLocationUpdate();
        return updated;
    }

    @Get()
    getAllLocations() {
        return this.locationService.getAllUserLocations;
    }

    @Get(':userId')
    getUserLocation(@Param('userId') userId: string) {
        return this.locationService.getLocationByUserId(Number(userId));
    }
}