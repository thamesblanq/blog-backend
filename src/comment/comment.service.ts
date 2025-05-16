import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,    
  ) {}


  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const createdComment = new this.commentModel({
      ...createCommentDto, 
      userId,
    })
    return createdComment.save();
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).populate('userId', 'email', 'name').exec();
  }

  async remove(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new NotFoundException('You are not authorized to delete this comment');
    }
    await this.commentModel.deleteOne({ _id: commentId });
  }
}
