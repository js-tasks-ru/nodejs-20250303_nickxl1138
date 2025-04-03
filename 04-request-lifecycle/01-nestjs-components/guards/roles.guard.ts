import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const xRoleHeader = context.switchToHttp().getRequest().headers["x-role"];

    if (xRoleHeader !== "admin") {
      throw new ForbiddenException("Доступ запрещён: требуется роль admin");
    }

    return true;
  }
}
