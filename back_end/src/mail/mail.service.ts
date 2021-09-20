import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}


  async verifyEmailAddress(to: string, token: string) {
    const url = ``;
    await this.mailerService.sendMail({
      to: to,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Please confirm your email address',
      template: './verify-email.hbs', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        url,
      },
      attachments: [{
        filename: 'logo.png',
        path: './src/images/logo.png',
        cid: 'logo' //same cid value as in the html img src
      }]
    });
  }
}