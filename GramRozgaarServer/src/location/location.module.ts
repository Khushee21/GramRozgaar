import { Module, forwardRef } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { LocationGateway } from "./location.gateway";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports: [forwardRef(() => LocationModule)],
    controllers: [LocationController],
    providers: [LocationService, LocationGateway, PrismaService],
    exports: [LocationService, LocationGateway],
})
export class LocationModule { }
