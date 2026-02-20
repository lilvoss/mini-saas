import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [AuthModule, WorkspaceModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
