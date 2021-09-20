import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {

  constructor(config: ConfigService) {
    super({
      clientID: config.get('FACEBOOK_CLIENT_ID'),
      clientSecret: config.get('FACEBOOK_SECRET'),
      callbackURL: config.get('CALLBACK_URL_FACEBOOK'),
      fbGraphVersion: 'v3.0',
      profileFields: ["email", "name"],
      enableProof: true
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { email, first_name, last_name } = profile._json;
    console.log('profile', profile)
    const user = {
      email: email,
      name: first_name
    }
    done(null, user);
  }
}