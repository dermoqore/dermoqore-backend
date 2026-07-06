import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findApproved() {
    return this.prisma.review.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIds(ids: string[]) {
    return this.prisma.review.findMany({
      where: { id: { in: ids }, status: 'APPROVED' },
    });
  }

  findById(id: string) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        name: dto.name,
        description: dto.description,
        rating: dto.rating ?? 5,
        image: dto.image,
        status: 'PENDING',
      },
    });
  }

  updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'INACTIVE') {
    return this.prisma.review.update({ where: { id }, data: { status } });
  }

  remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
