import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LocationService } from './location.service';

@WebSocketGateway({
    cors: { origin: '*' },
})
@Injectable()
export class LocationGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        @Inject(forwardRef(() => LocationService))
        private readonly locationService: LocationService,
    ) { }

    afterInit(server: Server) {
        server.use((socket: Socket, next) => {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new UnauthorizedException('No token provided'));
            }

            try {
                const decoded = jwt.verify(token, process.env.AT_SECRET!);
                socket.data.user = decoded;
                return next();
            } catch (err) {
                console.error('❌ Token verification failed:', err.message);
                return next(new UnauthorizedException('Invalid token'));
            }
        });
    }

    handleConnection(socket: Socket) {
        console.log('✅ Client connected:', socket.id, 'User:', socket.data.user?.sub);
    }

    handleDisconnect(socket: Socket) {
        console.log('❌ Client disconnected:', socket.id);
    }

    @SubscribeMessage('location')
    async handleLocation(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
        const user = socket.data.user;
        if (!user || !user.sub) {
            console.error('❌ No user found in socket');
            return;
        }

        const { latitude, longitude } = data;

        console.log(`📍 Received location from user ${user.sub}:`, latitude, longitude);

        await this.locationService.updateLocation(user.sub, latitude, longitude);
        this.broadcastLocationUpdate();
    }

    async broadcastLocationUpdate() {
        const locations = await this.locationService.getAllUserLocations();

        const enrichedLocations = locations.map((loc) => ({
            userId: loc.userId,
            latitude: loc.latitude,
            longitude: loc.longitude,
            updatedAt: loc.createdAt,
            emoji: "📍",
            user: {
                name: loc.user?.name || "Unknown",
                profileImage: loc.user?.profileImage || null,
            }
        }));


        this.server.emit('locationUpdate', enrichedLocations);
    }

}
