import { Controller, Post, Body, UseGuards, Req, Get, Param ,Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // 🔐 Créer un projet (seulement admin)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { name: string; workspaceId: string }, @Req() req: any) {
    return this.projectService.createProject(body.name, body.workspaceId, req.user.userId);
  }

  // 🔐 Voir les projets d'un workspace
  @UseGuards(JwtAuthGuard)
  @Get(':workspaceId')
  async getProjects(@Param('workspaceId') workspaceId: string) {
    return this.projectService.findWorkspaceProjects(workspaceId);
  }

   @UseGuards(JwtAuthGuard)
  @Delete(':projectId')
  async delete(@Param('projectId') projectId: string, @Req() req: any) {
    return this.projectService.deleteProject(projectId, req.user.userId);
  }
}