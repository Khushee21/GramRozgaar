import { Body, Controller, Get, Post, Param } from "@nestjs/common";
import { LocationService } from "./location.service";

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Post()
    updateLocation(@Body() body: { userId: number, latitude: number, longitude: number }) {
        return this.locationService.updateLocation(body.userId, body.latitude, body.longitude);
    }

    @Get()
    getAllLocations() {
        return this.locationService.gelAllUserLocations();
    }

    @Get(':userId')
    getUserLocation(@Param('userId') userId: string) {
        return this.locationService.getLocationByUserId(Number(userId));
    }

}