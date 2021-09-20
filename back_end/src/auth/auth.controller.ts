import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Response,
  Body,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { SignUpUserDto } from 'src/user/dto/signup-user.dto';
import JwtRefreshGuard from './guards/jwt-resfresh-auth.guard';
import JwtAccessAuthGuard from './guards/jwt-access-auth.guard';
import { User, UserDto } from 'src/decorators/user.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { MailService } from 'src/mail/mail.service';
import { ViewAuthFilter } from './filter/view-auth.filter';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  async loginLocal(@Body() signInDto: SignInDto, @Request() req, @Response() res) {
    const user = req.user._doc;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user._id,
    );
    const { refreshToken, refreshCookie } =
      this.authService.getCookieWithJwtRefreshToken(user._id);
    await this.userService.setCurrentRefreshToken(refreshToken, user._id);
    console.log('accessTokenCookie, cookie', accessTokenCookie, refreshCookie);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie]);
    res.redirect('/');
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('log_out')
  async logOut(@Response() res, @User() userDto: UserDto) {
    await this.userService.removeRefreshToken(userDto.userId);
    res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    res.redirect('/');
  }

  @Post('sign_up')
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    const result = await this.userService.create(signUpUserDto);
    this.mailService.verifyEmailAddress(result.email, result.tokenActiveEmail)
    return result;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh_token')
  async refreshToken(@Request() req) {
    const user = req.user;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user._id,
    );
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }
  
  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  @UseFilters(ViewAuthFilter)
  loginGithub() {}

  @Get('login/github/redirect')
  @UseGuards(AuthGuard('github'))
  @UseFilters(ViewAuthFilter)
  async githubAuthRedirect(@Request() req, @Response() res) {
    const user = req.user;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user._id,
    );
    const { refreshToken, refreshCookie } =
      this.authService.getCookieWithJwtRefreshToken(user._id);
    await this.userService.setCurrentRefreshToken(refreshToken, user._id);
    console.log('accessTokenCookie, cookie', accessTokenCookie, refreshCookie);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie]);
    res.redirect('/');
  }

  // @Get('login/google')
  // @UseGuards(AuthGuard('google'))
  // async loginGoogle() {}

  // @Get('login/google/redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Request() req, @Response() res) {
  //     res.redirect('/')
  // }

  // @Get('login/facebook')
  // @UseGuards(AuthGuard('facebook'))
  // loginFacebook() {}

  // @Get('login/facebook/redirect')
  // @UseGuards(AuthGuard('facebook'))
  // facebookAuthRedirect(@Request() req, @Response() res) {
  //     console.log('vl', req.user);
  //     res.redirect('/')
  // }

  // @Get('login/linkedin')
  // @UseGuards(AuthGuard('linkedin'))
  // loginLinkedin() {}

  // @Get('login/linkedin/redirect')
  // @UseGuards(AuthGuard('linkedin'))
  // linkedinAuthRedirect(@Request() req, @Response() res) {
  //     res.redirect('/dasboard')
  // }
}
