import { Injectable } from '@nestjs/common';
import { UserProvider } from './providers/user.provider';

@Injectable()
export class UserService {

  constructor(
    private readonly userProvider: UserProvider,
  ) { }

  async checkUsernameAvailability(username: string) {
    const user = await this.userProvider.findByUsername(username.toLocaleLowerCase());
    return !user;
  }

}
