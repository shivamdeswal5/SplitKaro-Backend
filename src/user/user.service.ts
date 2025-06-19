import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,

  ) { }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async updateProfile(id: string, updatedProfileData: UpdateProfileDto, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User Not Found ..')
    }
    const url = await this.handleUpload(file);
    user.profileImg = url;
    
    Object.assign(user,updatedProfileData);
    return this.userRepository.save(user);

  }

  async handleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }
    const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/avif'];
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File is to large, Please Compress and try again ...!');
    }
    const result = this.cloudinaryService.uploadImage(file);
    const url = (await result).secure_url;
    return url;
  }

  async getProfile(id: string) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const { password, ...rest } = user;
  return rest;
}

}
