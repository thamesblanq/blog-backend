import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name); 

  constructor(
    private readonly usersService: UsersService, // Ensure injection here
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    let existingUser: UserDocument | null = null;
    
    try {
      existingUser = await this.usersService.findByEmail(createUserDto.email);
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err; // re-throw unexpected errors
      }
    }
  
    if (existingUser) {
      this.logger.error(`User with email ${createUserDto.email} already exists`);
      throw new BadRequestException('User with this email already exists');
    }
  
    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);
    const roles = createUserDto.email === "obiwulugodswill@gmail.com" ? ['admin'] : ['user'];
  
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPwd,
      roles,
    });
  
    return { message: 'User registered successfully' };
  }
  
  
  async login(user: any):Promise<{ access_token: string }> {
      //JWT payload
      const payload = {
        email: user.email ?? user._doc?.email, // if using Mongoose
        roles: user.roles ?? user._doc?.roles, // if using Mongoose
        sub: user._id ?? user._doc?._id,       // 'sub' is required
      };
      console.log('JWT Payload:', payload); // Log the payload for debugging
      const isAdmin = user.roles?.includes('admin');
      const expiresIn = isAdmin ? '7d' : '1h';
      const token = this.jwtService.sign(payload, { expiresIn });
      return { access_token: token };
  }

  async validateUser(email: string, password: string):Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null
  }

}
