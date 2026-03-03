// src/auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) throw new ForbiddenException('Non authentifié');

    // ✅ Les params de route sont disponibles ici — NestJS les résout avant les guards
    const workspaceId = request.params?.workspaceId;
    if (!workspaceId) return true;

    // ✅ try/catch : une erreur Prisma ici (UUID malformé etc.) causait le 500
    let membership;
    try {
      membership = await this.prisma.membership.findUnique({
        where: { userId_workspaceId: { userId, workspaceId } },
      });
    } catch (err) {
      console.error('[RolesGuard] Prisma error:', err);
      throw new ForbiddenException('Erreur de vérification des permissions');
    }

    if (!membership || !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException('Permissions insuffisantes');
    }

    return true;
  }
}