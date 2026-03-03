import { WorkspaceService } from './workspace.service';
import { Role } from '@prisma/client';
export declare class WorkspaceController {
    private workspaceService;
    constructor(workspaceService: WorkspaceService);
    createWorkspace(body: {
        name: string;
    }, req: any): Promise<{
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
    getMyWorkspaces(req: any): Promise<{
        workspaceId: string;
        name: string;
        role: Role;
    }[]>;
    searchUsers(query: string): Promise<{
        id: string;
        fullName: string | null;
        email: string;
    }[]>;
    getMembers(workspaceId: string): Promise<({
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
    addMember(workspaceId: string, body: {
        userId: string;
        role: Role;
    }): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        role: Role;
        userId: string;
        workspaceId: string;
    }, unknown> & {}>;
}
