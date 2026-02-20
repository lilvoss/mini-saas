import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role, TaskStatus, Priority } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // 🔎 Vérifier membership
  private async checkMembership(userId: string, workspaceId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not in this workspace');
    }

    return membership;
  }

  // 🟢 CREATE
  async createTask(
    projectId: string,
    userId: string,
    data: {
      title: string;
      description?: string;
      status: TaskStatus;
      priority: Priority;
      dueDate?: Date;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.checkMembership(userId, project.workspaceId);

    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  // 🔵 READ
  async getProjectTasks(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Project not found');

    await this.checkMembership(userId, project.workspaceId);

    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  // 🟡 UPDATE
  async updateTask(
    taskId: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: Priority;
      dueDate: Date;
    }>,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.checkMembership(userId, task.project.workspaceId);

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  // 🔴 DELETE (ADMIN ONLY)
  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) throw new NotFoundException('Task not found');

    const membership = await this.checkMembership(
      userId,
      task.project.workspaceId,
    );

    if (membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admin can delete tasks');
    }

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}