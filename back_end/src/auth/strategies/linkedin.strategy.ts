import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {

  constructor(config: ConfigService) {
    super({
      clientID: config.get('LINKEDIN_CLIENT_ID'),
      clientSecret: config.get('LINKEDIN_SECRET'),
      callbackURL: config.get('CALLBACK_URL_LINKEDIN'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { firstName, lastName, photos } = profile._json
    const user = {
      email: profile.emails[0].value,
      firstName: firstName.localized.en_US,
      lastName: lastName.localized.en_US,
    }
    done(null, user);
  }
}