import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsOptional()
    @IsArray()
    tags?: string[];
    
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNotEmpty()
    @IsString()
    authorId: string;
}
