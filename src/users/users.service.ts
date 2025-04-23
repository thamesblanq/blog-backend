import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    return user || null;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user || null;
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();
    return users || null;
  }

  async create(userData: CreateUserDto): Promise<UserDocument> {
    //checking for existing user
    const existingUser = await this.userModel.findOne({ email: userData.email }).exec();
    if(existingUser) {
      throw new ConflictException('User already exists');
    }
    //create new user
    const user = new this.userModel(userData);
    try {
      return await user.save();
    } catch (error) {
      this.logger.error('Error occurred while saving user', error);
      throw new InternalServerErrorException('An error occurred while creating the user');
    }

  }

  async updateUserById(id: string, updateData: UpdateUserDto): Promise<UserDocument> {
    //find user and update
    const user = await this.userModel.findOneAndUpdate({ _id: id }, updateData, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('User not found in');
    }
    //no need to return user??
    return user;
  }

  async deleteUserById(id: string): Promise<void> {
    //find user
    const user = await this.userModel.findOne({ _id: id }).exec();
    //no user
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //delete user
    await user.deleteOne();
  }
}

/* 
findByEmail
findById
findAll
create
updateUser
deleteUser
*/