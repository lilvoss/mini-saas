import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskStatus, Priority } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ✅ Helper pour vérifier que le projet appartient bien au workspace
  private async checkProjectInWorkspace(projectId: string, workspaceId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.workspaceId !== workspaceId) {
      throw new NotFoundException('Project not found in this workspace');
    }

    return project;
  }

  // ✅ Helper pour vérifier que la task appartient bien au workspace
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

  // 🟢 CREATE — RolesGuard vérifie déjà le membership
  async createTask(
    projectId: string,
    workspaceId: string,
    data: {
      title: string;
      description?: string;
      status: TaskStatus;
      priority: Priority;
      dueDate?: Date;
    },
  ) {
    await this.checkProjectInWorkspace(projectId, workspaceId);

    return this.prisma.task.create({
      data: { ...data, projectId },
    });
  }

  // 🔵 READ
  async getProjectTasks(projectId: string, workspaceId: string) {
    await this.checkProjectInWorkspace(projectId, workspaceId);

    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  // 🟡 UPDATE
  async updateTask(
    taskId: string,
    workspaceId: string,
    data: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: Priority;
      dueDate: Date;
    }>,
  ) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  // 🔴 DELETE — ADMIN vérifié par RolesGuard
  async deleteTask(taskId: string, workspaceId: string) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  // 🔵 ASSIGN — ADMIN vérifié par RolesGuard
  async assignTask(taskId: string, workspaceId: string, memberUserId: string) {
    await this.checkTaskInWorkspace(taskId, workspaceId);

    // Vérifier que le membre assigné appartient au workspace
    const member = await this.prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId: memberUserId, workspaceId },
      },
    });

    if (!member) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { assignedTo: memberUserId },
    });
  }
}