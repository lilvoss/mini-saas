import { Controller, Post, Body, UseGuards, Req, Get, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ProjectService } from './project.service';

@Controller('workspaces/:workspaceId/projects') // ✅ workspaceId toujours dans l'URL
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // ADMIN only — RolesGuard vérifie automatiquement via :workspaceId
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { name: string },
  ) {
    return this.projectService.createProject(body.name, workspaceId);
  }

  // Tous les membres du workspace peuvent voir les projets
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MEMBER)
  @Get()
  async getProjects(@Param('workspaceId') workspaceId: string) {
    return this.projectService.findWorkspaceProjects(workspaceId);
  }

  // ADMIN only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':projectId')
  async delete(
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.deleteProject(projectId, workspaceId);
  }
}