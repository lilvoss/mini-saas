import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: import("@prisma/client/runtime").GetResult<{
            id: string;
            email: string;
            password: string;
            createdAt: Date;
        }, unknown> & {};
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: import("@prisma/client/runtime").GetResult<{
            id: string;
            email: string;
            password: string;
            createdAt: Date;
        }, unknown> & {};
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
        role: any;
    };
}
