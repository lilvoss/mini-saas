import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Sélection réutilisable pour l'assignee
const ASSIGNEE_SELECT = {
  select: { id: true, fullName: true, email: true }
};

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  private async checkProjectInWorkspace(projectId: string, workspaceId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundException('Project not found in this workspace');
    }
    return project;
  }

  private async checkTaskInWorkspace(taskId: string, workspaceId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task || task.project.workspaceId !== workspaceId) {
      throw new NotFoundException('Task not found in this workspace');
    }
    return task;
  }

  // 🟢 CREATE
  async createTask(projectId: string, workspaceId: string, body: any) {
    await this.checkProjectInWorkspace(projectId, workspaceId);

    return this.prisma.task.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        priority: body.priority ?? 'MEDIUM',
        status: 'TODO',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        projectId,
      },
      include: { assignee: ASSIGNEE_SELECT }, // ✅
    });
  }

  // 🔵 READ — inclure assignee pour chaque task
  async getProjectTasks(projectId: string, workspaceId: string) {
    await this.checkProjectInWorkspace(projectId, workspaceId);

    return this.prisma.task.findMany({
      where: { projectId },
      include: { assignee: ASSIGNEE_SELECT }, // ✅ sans ça, task.assignee = undefined côté frontend
    
    });
  }

  // 🟡 UPDATE
  async updateTask(taskId: string, workspaceId: string, body: any) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: { assignee: ASSIGNEE_SELECT }, // ✅
    });
  }

  // 🔴 DELETE
  async deleteTask(taskId: string, workspaceId: string) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  // 🔵 ASSIGN
  async assignTask(taskId: string, workspaceId: string, memberUserId: string) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    const member = await this.prisma.membership.findUnique({
      where: { userId_workspaceId: { userId: memberUserId, workspaceId } },
    });
    if (!member) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: memberUserId },
      include: { assignee: ASSIGNEE_SELECT }, // ✅ retourner l'assignee complet
    });
  }
}