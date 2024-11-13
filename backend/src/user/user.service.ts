import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);
    await this.cacheManager.set(`user:${user.id}`, user);
    await this.cacheManager.set(`user:email:${user.email}`, user);
    await this.cacheManager.set(`user:phone:${user.phoneNumber}`, user);
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  updateEmailVerificationStatus(email: string) {
    return this.userRepository.update({email}, {emailVerifiedDate: new Date()});
  }

  updatePhoneNumberVerificationStatus(phoneNumber: string) {
    return this.userRepository.update({phoneNumber}, {phoneNumberVerifiedDate: new Date()});
  }

  updatePasswordByEmail(email: string, password: string) {
    return this.userRepository.update({email}, {password});
  }

  updatePasswordByPhoneNumber(phoneNumber: string, password: string) {
    return this.userRepository.update({phoneNumber}, {password});
  }

  async remove(id: string) {
    await this.cacheManager.del(`user:${id}`);
    return this.userRepository.delete(id);
  }
}
