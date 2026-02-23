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

  async assignTask(taskId: string, byUserId: string, memberUserId: string) {
  // Vérifier que la task existe et récupérer le workspace du projet
  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { workspace: true } } },
  });

  if (!task) throw new NotFoundException('Task not found');

  // Vérifier que l’utilisateur qui assigne est ADMIN du workspace
  const membership = await this.prisma.membership.findUnique({
    where: {
      userId_workspaceId: { userId: byUserId, workspaceId: task.project.workspaceId },
    },
  });

  if (!membership || membership.role !== 'ADMIN') {
    throw new ForbiddenException('Only admin can assign tasks');
  }

  // Vérifier que le membre assigné appartient au workspace
  const member = await this.prisma.membership.findUnique({
    where: {
      userId_workspaceId: { userId: memberUserId, workspaceId: task.project.workspaceId },
    },
  });

  if (!member) {
    throw new ForbiddenException('User is not a member of this workspace');
  }

  // Assigner la task
  return this.prisma.task.update({
    where: { id: taskId },
    data: { assignedTo: memberUserId },
  });
}
}