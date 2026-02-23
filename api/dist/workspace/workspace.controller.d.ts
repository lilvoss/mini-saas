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
    addMember(workspaceId: string, body: {
        userId: string;
        role: Role;
    }, req: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        role: Role;
        userId: string;
        workspaceId: string;
    }, unknown> & {}>;
}
