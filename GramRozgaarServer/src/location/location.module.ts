import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [LocationController],
    providers: [LocationController, PrismaService],
})

export class LocationModule { }