import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

// ✅ workspaceId toujours dans l'URL pour le RolesGuard
@Controller('workspaces/:workspaceId/projects/:projectId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // Tous les membres peuvent créer une task
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() body: any,
  ) {
    return this.taskService.createTask(projectId, workspaceId, body);
  }

  // Tous les membres peuvent voir les tasks
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  @Get()
  getTasks(@Param('projectId') projectId: string, @Param('workspaceId') workspaceId: string) {
    return this.taskService.getProjectTasks(projectId, workspaceId);
  }

  // Tous les membres peuvent modifier une task
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() body: any,
  ) {
    return this.taskService.updateTask(taskId, workspaceId, body);
  }

  // ADMIN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':taskId')
  delete(
    @Param('taskId') taskId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.taskService.deleteTask(taskId, workspaceId);
  }

  // ADMIN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':taskId/assign')
  assign(
    @Param('taskId') taskId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() body: { memberUserId: string },
  ) {
    return this.taskService.assignTask(taskId, workspaceId, body.memberUserId);
  }
}