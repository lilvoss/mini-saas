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
    searchUsersByFullName(query: string): Promise<{
        id: string;
        fullName: string | null;
        email: string;
    }[]>;
    getWorkspaceMembers(workspaceId: string): Promise<({
        user: {
            id: string;
            fullName: string | null;
            email: string;
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        role: Role;
        userId: string;
        workspaceId: string;
    }, unknown> & {})[]>;
    addMember(workspaceId: string, userIdToAdd: string, role: Role): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        role: Role;
        userId: string;
        workspaceId: string;
    }, unknown> & {}>;
}
