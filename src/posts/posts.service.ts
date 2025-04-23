import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel({
      ...createPostDto,
      imageUrl: createPostDto.imageUrl, // Ensure the image URL is included in the post creation
    });
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true }).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<void> {
    const result = await this.postModel.deleteOne({ _id: id}).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
