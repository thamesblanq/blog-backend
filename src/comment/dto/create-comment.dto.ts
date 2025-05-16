import { IsMongoId, IsNotEmpty, IsString, isMongoId } from 'class-validator';

export class CreateCommentDto {
    @IsMongoId()
    postId: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
