import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userId: string) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        memberships: {
          create: {
            userId,
            role: Role.ADMIN,
          },
        },
      },
      include: { memberships: true },
    });

    return workspace;
  }

  async findUserWorkspaces(userId: string) {
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

  
  async addMember(workspaceId: string, userIdToAdd: string, role: Role) {
    return this.prisma.membership.create({
      data: {
        userId: userIdToAdd,
        workspaceId,
        role,
      },
    });
  }
}