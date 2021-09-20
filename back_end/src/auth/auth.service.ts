import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UserStatus } from 'src/user/enum/status.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await this.userService.compareHash(password, user.password)) {
      if (user.status !== UserStatus.Active) {
        throw new HttpException('Oops! It looks like you haven’t confirmed your email yet!', HttpStatus.UNAUTHORIZED);
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserAdmin(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await this.userService.compareHash(password, user.password) && (user as any).role === 'admin') {
      if (user.status !== UserStatus.Active) {
        throw new HttpException('Oops! It looks like you haven’t confirmed your email yet!', HttpStatus.UNAUTHORIZED);
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    console.log(`${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`)
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`
    });
    return `Authentication=${token}; HttpOnly; Path=/;`;
  }
 
  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`
    });
    const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; `;
    return {
      refreshCookie,
      refreshToken
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }
}