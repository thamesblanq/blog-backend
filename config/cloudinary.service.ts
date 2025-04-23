import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('No valid file received');
    }

    try {
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            public_id: file.originalname,
            folder: 'blog-pictures',
            unique_filename: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        );

        stream.end(file.buffer); // pipe the buffer into the stream
      });

      return result.secure_url;
    } catch (error: any) {
      throw new Error('Error uploading image to Cloudinary: ' + error.message);
    }
  }
}
