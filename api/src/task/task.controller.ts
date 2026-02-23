import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskService } from './task.service';

@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.taskService.createTask(projectId, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Param('projectId') projectId: string, @Req() req: any) {
    return this.taskService.getProjectTasks(projectId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.taskService.updateTask(taskId, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId')
  delete(@Param('taskId') taskId: string, @Req() req: any) {
    return this.taskService.deleteTask(taskId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
@Patch(':taskId/assign')
assign(
  @Param('taskId') taskId: string,
  @Body() body: { userId: string }, // le membre à assigner
  @Req() req: any,
) {
  return this.taskService.assignTask(taskId, req.user.userId, body.userId);
}
}