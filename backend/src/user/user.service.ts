import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findById(id: string) {
    return this.userRepository.findOne({where: {id}});
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({where: {email}});
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.userRepository.findOne({where: {phoneNumber}});
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

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
