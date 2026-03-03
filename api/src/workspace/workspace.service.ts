import { Injectable, ConflictException } from '@nestjs/common';
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

  async searchUsersByFullName(query: string) {
    if (!query || query.trim().length < 2) return [];

    return this.prisma.user.findMany({
      where: {
        fullName: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      take: 8,
      orderBy: { fullName: 'asc' },
    });
  }

  async getWorkspaceMembers(workspaceId: string) {
    return this.prisma.membership.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { role: 'asc' },
    });
  }

  async addMember(workspaceId: string, userIdToAdd: string, role: Role) {
    try {
      return await this.prisma.membership.create({
        data: {
          userId: userIdToAdd,
          workspaceId,
          role,
        },
      });
    } catch (err: any) {
      // P2002 = unique constraint violated → utilisateur déjà membre
      if (err?.code === 'P2002') {
        throw new ConflictException(
          'Cet utilisateur est déjà membre de ce workspace',
        );
      }
      throw err;
    }
  }
}