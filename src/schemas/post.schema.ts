import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Handles createdAt & updatedAt
export class Post {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  @IsString()
  @IsNotEmpty()
  authorId: Types.ObjectId; // Could be ObjectId too, depending on how you're querying

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  imageUrl: string; // Just store the URL
}

export const PostSchema = SchemaFactory.createForClass(Post);
