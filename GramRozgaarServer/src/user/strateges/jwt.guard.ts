import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    // constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];
        // console.log('Auth header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            //console.log('❌ Missing or malformed Authorization header');
            throw new UnauthorizedException('Authorization token not found');
        }

        const token = authHeader.split(' ')[1];
        //console.log(token);
        try {
            const decoded = jwt.verify(token, process.env.AT_SECRET!);
            console.log('Decoded JWT:', decoded);
            request['user'] = decoded;
            return true;
        } catch (err) {
            console.log('JWT verification failed:', err.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
