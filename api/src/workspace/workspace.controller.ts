import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

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

  @UseGuards(JwtAuthGuard)
@Post(':workspaceId/members')
async addMember(
  @Param('workspaceId') workspaceId: string,
  @Body() body: { userId: string; role: Role },
  @Req() req: any,
) {
  return this.workspaceService.addMember(
    workspaceId,
    body.userId,
    body.role,
    req.user.userId,
  );
}
}