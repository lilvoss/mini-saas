import { WorkspaceService } from './workspace.service';
export declare class WorkspaceController {
    private workspaceService;
    constructor(workspaceService: WorkspaceService);
    createWorkspace(body: {
        name: string;
    }, req: any): Promise<{
        memberships: (import("@prisma/client/runtime").GetResult<{
            id: string;
            role: import(".prisma/client").Role;
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
        role: import(".prisma/client").Role;
    }[]>;
}
