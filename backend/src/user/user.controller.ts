import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEndpoints } from 'src/common/enums/endpoints.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(UserEndpoints.CHECK_USERNAME)
  @HttpCode(HttpStatus.OK)
  async checkAvailability(@Query("username") username: string){
    return this.userService.checkUsernameAvailability(username);
  }

}
