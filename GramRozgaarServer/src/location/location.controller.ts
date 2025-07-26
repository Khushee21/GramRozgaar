// location.controller.ts
import { Body, Controller, Get, Post, Param, UseGuards, Req } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationGateway } from "./location.gateway";
import { WebSocketGateway } from "@nestjs/websockets";
import { JwtAuthGuard } from "src/user/strateges/jwt.guard";
import { UnauthorizedException } from "@nestjs/common";
import { RequestWithUser } from "src/types/RequestWithUser";

@Controller('location')
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly locationGateway: LocationGateway
    ) { }

    @Post()
    async updateLocation(@Req() req: RequestWithUser, @Body() body: { latitude: number, longitude: number }) {
        const userId = req.user['userId'];
        if (!userId) {
            console.error("❌ No userId in token");
            throw new UnauthorizedException("Invalid token payload");
        }

        console.log("📩 Received location update:", { userId, ...body });
        const updated = await this.locationService.updateLocation(userId, body.latitude, body.longitude);
        this.locationGateway.broadcastLocationUpdate();
        return updated;
    }

    @Get()
    getAllLocations() {
        return this.locationService.getAllUserLocations();
    }

    @Get(':userId')
    getUserLocation(@Param('userId') userId: string) {
        return this.locationService.getLocationByUserId(Number(userId));
    }
}