import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  // 🔐 Créer workspace
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWorkspace(@Body() body: { name: string }, @Req() req: any) {
    const userId = req.user.userId; // ✅ Passport injecte ici le payload retourné par validate()
    return this.workspaceService.create(body.name, userId);
  }

  // 🔐 Voir les workspaces du user
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyWorkspaces(@Req() req: any) {
    const userId = req.user.userId;
    return this.workspaceService.findUserWorkspaces(userId);
  }
}