import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/strateges/jwt.guard';
import { Worker_machineServices } from './worker_machine.services';

@Controller('workers')
export class Machine_WorkerController {
    constructor(private readonly machine_workerServices: Worker_machineServices) { }

    @Get('all-machines')
    @UseGuards(JwtAuthGuard)
    async AllMachines(@Req() req: any) {
        return this.machine_workerServices.getAllMachine(req.user.id);
    }

    @Get('all-workers')
    @UseGuards(JwtAuthGuard)
    async AllWorkers(@Req() req: any) {
        return this.machine_workerServices.getAllWorker(req.user.id);
    }
}
