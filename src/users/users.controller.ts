import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // 👈 only admin can access
  testAdminRoute() {
  return { message: 'Hello Admin! Only admins can see this.' };
  }

  // Get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    console.log('Decoded user from request:', req.user);
    return await this.usersService.findAll();
  }

  // Get a specific user by ID (no email param for security)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req) {
    // Validate that the user can only fetch their own data
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only access your own details');
    }
    return await this.usersService.findById(id);
  }

  // Update specific user by ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    // Validate that the user can only update their own data
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only update your own details');
    }

    // Update user and send response
    const updatedUser = await this.usersService.updateUserById(id, updateUserDto);

    return {
      message: 'User details updated. Please log in again with the new credentials.',
      success: true,
      user: updatedUser,  // Optionally return the updated user data
    };
  }

  // Delete specific user by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    // Validate that the user can only delete their own account
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }

    // Delete user
    await this.usersService.deleteUserById(id);

    return { message: 'Account deleted successfully' };
  }
}
