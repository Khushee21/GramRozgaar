import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { LocationService } from "./location.service";

@WebSocketGateway({
    cors: { origin: '*' },
})
@Injectable()
export class LocationGateway {
    @WebSocketServer() server: Server;

    constructor(
        @Inject(forwardRef(() => LocationService))
        private readonly locationService: LocationService,
    ) { }

    async broadcastLocationUpdate() {
        const locations = await this.locationService.getAllUserLocations();
        this.server.emit('locationUpdate', locations);
    }
}
