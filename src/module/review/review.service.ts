import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly repo: ReviewRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  findAll() {
    return this.repo.findAll();
  }

  findApproved() {
    return this.repo.findApproved();
  }

  findByIds(ids: string[]) {
    return this.repo.findByIds(ids);
  }

  async create(dto: CreateReviewDto) {
    return this.repo.create(dto);
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.cloudinary.uploadImage(file, 'reviews');
    return { url };
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    const review = await this.repo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return this.repo.updateStatus(id, dto.status);
  }

  async remove(id: string) {
    const review = await this.repo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return this.repo.remove(id);
  }
}
