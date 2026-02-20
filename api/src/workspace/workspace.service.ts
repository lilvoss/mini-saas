import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  // Créer un workspace et ajouter le user comme ADMIN
  async create(name: string, userId: string) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        memberships: {
          create: { 
            userId, // <-- direct ici
            role: Role.ADMIN, // ou 'ADMIN' si tu préfères
        },
        },
      },
      include: { memberships: true },
    });

    return workspace;
  }

  // Récupérer tous les workspaces où l'utilisateur a un membership
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
}