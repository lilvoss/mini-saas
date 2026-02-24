import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createWorkspace(@Body() body: { name: string }, @Req() req: any) {
    return this.workspaceService.create(body.name, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyWorkspaces(@Req() req: any) {
    return this.workspaceService.findUserWorkspaces(req.user.userId);
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':workspaceId/members')
  addMember(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { userId: string; role: Role },
  ) {
    return this.workspaceService.addMember(workspaceId, body.userId, body.role);
  }
}