import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
        sub: number;
        iat?: number;
        exp?: number;
    };
}
