import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('rejects requests without an access token', async () => {
    const authService = {
      validateToken: jest.fn(),
    };
    const guard = new JwtAuthGuard(authService as never);
    const request = { headers: {} } as never;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(authService.validateToken).not.toHaveBeenCalled();
  });

  it('validates the access token cookie and attaches the user', async () => {
    const user = { id: 7, username: 'demo' };
    const authService = {
      validateToken: jest.fn().mockResolvedValue(user),
    };
    const guard = new JwtAuthGuard(authService as never);
    const request = { headers: { cookie: 'theme=dark; access_token=token-value' } } as never;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(authService.validateToken).toHaveBeenCalledWith('token-value');
    expect(request.user).toEqual(user);
  });
});
