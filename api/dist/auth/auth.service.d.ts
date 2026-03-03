import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, password: string, fullName?: string): Promise<{
        token: string;
        user: import("@prisma/client/runtime").GetResult<{
            id: string;
            email: string;
            password: string;
            fullName: string | null;
            createdAt: Date;
        }, unknown> & {};
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: import("@prisma/client/runtime").GetResult<{
            id: string;
            email: string;
            password: string;
            fullName: string | null;
            createdAt: Date;
        }, unknown> & {};
    }>;
}
