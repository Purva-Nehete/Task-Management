import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  username: string;
  title: string | null;
  avatar: string | null;
  isGuest: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginDto.identifier },
          { username: loginDto.identifier },
        ],
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(user);
  }

  async guestLogin() {
    const user = await this.prisma.user.findFirst({
      where: { isGuest: true },
    });

    if (!user) {
      throw new UnauthorizedException('Guest account is not configured');
    }

    return this.createSession(user);
  }

  async validateToken(token: string): Promise<AuthUser> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.toAuthUser(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  private async createSession(user: {
    id: number;
    name: string;
    email: string;
    username: string;
    title: string | null;
    avatar: string | null;
    isGuest: boolean;
  }) {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: {
    id: number;
    name: string;
    email: string;
    username: string;
    title: string | null;
    avatar: string | null;
    isGuest: boolean;
  }): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
      isGuest: user.isGuest,
    };
  }
}
