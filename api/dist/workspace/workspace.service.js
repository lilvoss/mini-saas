"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let WorkspaceService = class WorkspaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(name, userId) {
        const workspace = await this.prisma.workspace.create({
            data: {
                name,
                memberships: {
                    create: {
                        userId,
                        role: client_1.Role.ADMIN,
                    },
                },
            },
            include: { memberships: true },
        });
        return workspace;
    }
    async findUserWorkspaces(userId) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: { workspace: true },
        });
        return memberships.map((m) => ({
            workspaceId: m.workspace.id,
            name: m.workspace.name,
            role: m.role,
        }));
    }
    async addMember(workspaceId, userIdToAdd, role, currentUserId) {
        const membership = await this.prisma.membership.findUnique({
            where: {
                userId_workspaceId: {
                    userId: currentUserId,
                    workspaceId,
                },
            },
        });
        if (!membership || membership.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only admin can add members');
        }
        return this.prisma.membership.create({
            data: {
                userId: userIdToAdd,
                workspaceId,
                role,
            },
        });
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map