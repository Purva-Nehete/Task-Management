import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, AuthUser } from '../auth.service';

export type AuthenticatedRequest = Request & { user: AuthUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.getCookie(request.headers.cookie, 'access_token');

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = await this.authService.validateToken(token);
    return true;
  }

  private getCookie(cookieHeader: string | undefined, name: string) {
    const value = cookieHeader
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);

    return value ? decodeURIComponent(value) : undefined;
  }
}
