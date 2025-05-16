import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId, ref: "Post", required: true })
    postId: Types.ObjectId;
    
    @Prop({ required: true })
    content: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);