import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // ✅ Plus de vérification manuelle — RolesGuard s'en charge
  async createProject(name: string, workspaceId: string) {
    return this.prisma.project.create({
      data: { name, workspaceId },
    });
  }

  async findWorkspaceProjects(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
    });
  }

  // ✅ On reçoit workspaceId depuis le contrôleur — plus besoin de le retrouver via le projet
  async deleteProject(projectId: string, workspaceId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundException('Project not found in this workspace');
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}