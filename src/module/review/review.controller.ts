import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Public — submit a review
  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // Public — upload review image
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.reviewService.uploadImage(file);
  }

  // Public — get approved reviews
  @Get()
  findApproved() {
    return this.reviewService.findApproved();
  }

  // Admin — get all reviews
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.reviewService.findAll();
  }

  // Admin — update status (approve / deactivate)
  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReviewStatusDto) {
    return this.reviewService.updateStatus(id, dto);
  }

  // Admin — delete
  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
