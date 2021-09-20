import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';


@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {

  constructor(
    private config: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_SECRET'),
      callbackURL: config.get('CALLBACK_URL_GITHUB'),
      scope:  'user:email',
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { profileUrl, emails, _json } = profile
    const user = {
      id: _json.id,
      email: emails[0].value,
      bio: _json.bio,
      profileUrl,
      avatar_link: _json.avatar_url,
      login_name: _json.login,
      twitter: _json.twitter_username,
      website: _json.blog,
    }
    console.log('profile', profile);
    let userFromDb = await this.userService.findByEmail(user.email);
    if (!userFromDb) {
      userFromDb = await this.userService.updateGithub(user)
    } else if (userFromDb && !userFromDb.isConnectGithub) {
      await this.userService.updateConnectGithub(userFromDb._id, true)
    }
    done(null, userFromDb);
  }
}