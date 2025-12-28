import {
  Controller,
  NotFoundException,
  NotAcceptableException,
  UnauthorizedException,
  Param,
  Post
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatuses } from './users.entity';
// importing the class and the enum (crucial)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login/:username')
  async login(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    // using username as a key to query a DB is not the best practice here.
    // we must prevent melicious code which will abuse a query like this.
    // i would love to see a more secure way by adding a password or a 3rd party login method (google apple etc...)
    // utilizing a token and cookie.
    // after that adding refresh token with TTL so we can keep our users logged in for an extended period of time
    // with out the need to re login would be a great UX.

    if (!user) {
      throw new NotFoundException(`The user - ${username} - not found`);
    }

    // we will add here an adjustment to our changes since we modified entity file
    if (user.status === UserStatuses.DISABLED) {
      throw new NotAcceptableException(`Access denied due to server status ${UserStatuses.DISABLED}`)
      // usually error messages which will be seen by users in our application are provided by product manager.
      // i used a generic text here just for the example.
    }

    if (user.status === UserStatuses.DELETED) {
      //UnauthorizedException should return HTTP 401 Unauthorized as asked.
      //
      throw new UnauthorizedException(`Authentication for user ${username} failed`)
      // same for the error message here
    }

    return user;
  }
}
