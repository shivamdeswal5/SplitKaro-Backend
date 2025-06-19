import { Body, Controller, Get, Param, Patch, Req, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedRequest } from './types/authenticated-request';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Patch('profile')
    @UseInterceptors(FileInterceptor('file'))
    updateProfile(
        @Req() req :AuthenticatedRequest,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateProfileDto:UpdateProfileDto
    ) {
        console.log(req.user);
        const userId = req.user?.id;
        console.log("User Id: ",userId);
        if (!userId) {
            throw new UnauthorizedException('User ID not found in request');
        }
        return this.userService.updateProfile(userId, updateProfileDto, file);
    }

    @Get('profile')
    getProfile(@Req() req: AuthenticatedRequest) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.userService.getProfile(userId);
    }

    
}
