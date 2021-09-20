import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { MailModule } from 'src/mail/mail.module';
import { AdminStrategy } from './strategies/admin.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ConfigModule,
    MailModule,
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtAccessTokenStrategy, 
    JwtRefreshTokenStrategy,
    GoogleStrategy, 
    GithubStrategy,
    FacebookStrategy,
    LinkedinStrategy,
    AdminStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}