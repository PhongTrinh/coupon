
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserStatus } from './enum/status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private readonly UserModel: Model<UserDocument>,
  ) { }

 
  
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await this.hash(refreshToken);
    await this.UserModel.findByIdAndUpdate(userId, { currentHashedRefreshToken: `${currentHashedRefreshToken}` })
  }

  async removeRefreshToken(userId: string) {
    await this.UserModel.findByIdAndUpdate(userId, { currentHashedRefreshToken: null })
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    if (await this.compareHash(refreshToken, user.currentHashedRefreshToken)) {
      return user;
    }
  }

  async create(signUpUserDto: SignUpUserDto) {
    const user = await this.findByEmail(signUpUserDto.email)
    if (user) {
      throw new HttpException('Email is exists!', HttpStatus.BAD_REQUEST);
    }
    const name = `${signUpUserDto.firstName}${signUpUserDto.lastName}`.split('.').join('')
    let userName = await this.getUserName(name);
    const createdUser = new this.UserModel({
      ...signUpUserDto,
      userName,
      tokenActiveEmail: uuidv4(8),
      password: await this.hash(signUpUserDto.password)
    });
    const userFromDB = await createdUser.save();
    return userFromDB.toJSON();
  }

  async getUserName(name: string) {
    const user = await this.findOne({
      userName: name,
    })
    if (user) {
      const _name = `${name}${this.randomString(4)}`
      return this.getUserName(_name);
    }
    return name;
  }



  randomString(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async updateGithub(githubUserDto: any) {
    const userName = await this.getUserName(githubUserDto.login_name);
    const website = this._getWebsite(githubUserDto.website);
    return this.UserModel.findOneAndUpdate({
      email: githubUserDto.email,
    }, {
      firstName: githubUserDto.login_name,
      userName,
      bio: githubUserDto.bio,
      avatar_link: githubUserDto.avatar_link,
      github: githubUserDto.profileUrl?.replace('https://github.com/',''),
      isConnectGithub: true,
      twitter: githubUserDto.twitter,
      website,
    }, { upsert: true, new: true })
  }

  _getWebsite(link: string) {
    if (!link) {
      return '';
    }
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }
    return `http://${link}`;
  }

  async updateConnectGithub(userId: string, isConnectGithub: boolean) {
    await this.UserModel.findByIdAndUpdate(userId, { isConnectGithub })
  }

  async findById(userId: string) {
    return this.UserModel.findOne({
      _id: userId,
    }).exec();
  }

  async findByUserName(userName: string) {
    return this.UserModel.findOne({
      userName: userName,
    }).exec();
  }

  async deleteById(userId: string) {
    return await this.UserModel.findByIdAndDelete(userId);
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email: email }).exec();
  }

  async findByIds(ids: string[], options = {}) {
    return this.UserModel.find({
      _id: {
        $in: ids,
      },
    }, options);
  }

  async updateStatusAndToken(email, status: string, token?: string) {
    await this.UserModel.findOneAndUpdate({
      email: email,
    }, {
      status,
      tokenActiveEmail: token,
    })
  }

  async updateVerifyEmailToken(email, token?: string) {
    await this.UserModel.findOneAndUpdate({
      email: email,
    }, { tokenActiveEmail: token })
  }

  async findAll() {
    return this.UserModel.find({
      status: UserStatus.Active
    });
  }

  async hash(password) {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }

  async compareHash(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async findOne(conditions) {
    return this.UserModel.findOne(conditions);
  }

}

