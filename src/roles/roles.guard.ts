import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // ✅ no nested destructuring

    if (!user || !user.roles) {
      throw new ForbiddenException('No user or roles found in request.');
    }

    const hasRole = user.roles.some((role: string) =>
      requiredRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required: ${requiredRoles.join(
          ', ',
        )}. Found: ${user.roles.join(', ')}`,
      );
    }

    return true;
  }
}
