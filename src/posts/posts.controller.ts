import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'config/cloudinary.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService, // Inject the CloudinaryService
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard) // Ensure the user is authenticated
  @Roles('admin', 'user') // Only admin can upload images
  @UseInterceptors(FileInterceptor('file')) // Use the FileInterceptor to handle file uploads
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new Error('No file received');
    }
    console.log('File received:', file); // Log the received file for debugging  

  // Call the uploadImage method from the CloudinaryService
  const imageUrl = await this.cloudinaryService.uploadImage(file);
  return { url: imageUrl };
  }

  //create new post
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Ensure the user is authenticated
  @Roles('admin', 'user') // Only admin can create posts
  create(@Body() createPostDto: CreatePostDto) {
    const { imageUrl } = createPostDto; // Extract the image URL from the request body
    return this.postsService.create(createPostDto);
  }

  //get all posts
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  //get post by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  //update post by id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Ensure the user is authenticated
  @Roles('admin', 'user') // Only admin can update posts
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  //delete post by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Ensure the user is authenticated
  @Roles('admin', 'user') // Only admin can delete posts
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
