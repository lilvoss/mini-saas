import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(name: string, workspaceId: string, userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    if (!membership || membership.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to create projects in this workspace');
    }

    return this.prisma.project.create({
      data: { name, workspaceId },
    });
  }

  async findWorkspaceProjects(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }

  // 🔥 SUPPRESSION PROJET
  async deleteProject(projectId: string, userId: string) {
    // 1️⃣ Vérifier que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // 2️⃣ Vérifier que l'utilisateur est ADMIN du workspace
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!membership || membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admin can delete this project');
    }

    // 3️⃣ Supprimer le projet
    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}