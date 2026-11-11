import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { addUserDto } from './dto/user.dto';
import { deleteUserDto } from './dto/delete.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { CurrentUser } from '../../common/decorator/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('add-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  addUser(@Body(new ValidationPipe()) data: addUserDto) {
    return this.userService.addUser(data);
  }

  @Patch('update-user/:id')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) data: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.role !== RoleEnum.ADMIN && currentUser.id !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.userService.updateUser(id, data);
  }

  @Delete('delete-user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  deleteUser(@Param(new ValidationPipe()) data: deleteUserDto) {
    return this.userService.deleteUser(data);
  }
}
