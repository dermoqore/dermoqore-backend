import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
