import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserProvider {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  private async setUserCache(user: User) {
    await this.cacheManager.set(`user:${user.id}`, user);
    await this.cacheManager.set(`user:email:${user.email}`, user);
    user.phoneNumber && await this.cacheManager.set(`user:phone:${user.phoneNumber}`, user);
    await this.cacheManager.set(`user:username:${user.username}`, user);
  }

  private async updateUserCache({email, phoneNumber}:{email?: string, phoneNumber?: string}) {
    const user = email ? await this.userRepository.findOne({ where: { email } }) : await this.userRepository.findOne({ where: { phoneNumber } });
    await this.setUserCache(user);
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    await this.setUserCache(user);
    return user;
  }

  async findById(id: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.cacheManager.set(`user:${id}`, user);
    }
    return user;
  }

  async findByEmail(email: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:email:${email}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      await this.cacheManager.set(`user:email:${email}`, user);
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:phone:${phoneNumber}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (user) {
      await this.cacheManager.set(`user:phone:${phoneNumber}`, user);
    }
    return user;
  }

  async findByUsername(username: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:username:${username}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      await this.cacheManager.set(`user:username:${username}`, user);
    }
    return user;
  }

  async findByGoogleId(googleId: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:googleId:${googleId}`);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { googleId } });
    if (user) {
      await this.cacheManager.set(`user:googleId:${googleId}`, user);
    }
    return user;
  }

  async createGoogleUser(createUserDto: Omit<CreateUserDto, "password">, googleId: string) {
    const user = await this.userRepository.save({ ...createUserDto, googleId, emailVerifiedDate: new Date() });
    await this.setUserCache(user);
    await this.cacheManager.set(`user:googleId:${googleId}`, user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOne({ where: { id } });
    await this.setUserCache(user);
    return user;
  }

  async updateEmailVerificationStatus(email: string) {
    await this.userRepository.update({ email }, { emailVerifiedDate: new Date() });
    this.updateUserCache({email});
    return true;
  }

  async updatePhoneNumberVerificationStatus(phoneNumber: string) {
    await this.userRepository.update({ phoneNumber }, { phoneNumberVerifiedDate: new Date() });
    this.updateUserCache({phoneNumber});
    return true;
  }

  async updatePasswordByEmail(email: string, password: string) {
    await this.userRepository.update({ email }, { password });
    this.updateUserCache({email});
    return true;
  }

  async updatePasswordByPhoneNumber(phoneNumber: string, password: string) {
    await this.userRepository.update({ phoneNumber }, { password });
    this.updateUserCache({phoneNumber});
    return true;
  }

  async remove(id: string) {
    await this.cacheManager.del(`user:${id}`);
    return this.userRepository.delete(id);
  }
}
