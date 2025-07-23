import { Module } from "@nestjs/common";
import { Worker_machineServices } from "./worker_machine.services";
import { Machine_WorkerController } from "./worker_machines.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthServices } from "src/auth/auth.service";

@Module({
    imports: [],
    controllers: [Machine_WorkerController],
    providers: [Worker_machineServices, PrismaService, AuthServices],
})
export class Worker_machine { }
