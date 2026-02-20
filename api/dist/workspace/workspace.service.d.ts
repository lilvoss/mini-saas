import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
export declare class WorkspaceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(name: string, userId: string): Promise<{
        memberships: (import("@prisma/client/runtime").GetResult<{
            id: string;
            role: Role;
            userId: string;
            workspaceId: string;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        name: string;
        createdAt: Date;
    }, unknown> & {}>;
    findUserWorkspaces(userId: string): Promise<{
        workspaceId: string;
        name: string;
        role: Role;
    }[]>;
}
