import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ReviewRepository } from '../review/review.repository';
import { CreateCampaignDto, PlaceCampaignOrderDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly repo: CampaignRepository,
    private readonly cloudinary: CloudinaryService,
    private readonly reviewRepo: ReviewRepository,
  ) {}

  async findAll(adminView = false) {
    if (adminView) return this.repo.findAll();
    return this.repo.findActive();
  }

  async findOne(slug: string) {
    const campaign =
      (await this.repo.findBySlug(slug)) ??
      (await this.repo.findById(slug));
    if (!campaign) throw new NotFoundException('Campaign not found');
    const reviewIds = Array.isArray(campaign.reviewIds) ? (campaign.reviewIds as string[]) : [];
    const reviews = reviewIds.length ? await this.reviewRepo.findByIds(reviewIds) : [];
    return { ...campaign, reviews };
  }

  async create(dto: CreateCampaignDto) {
    const slug = dto.slug ?? dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await this.repo.findBySlug(slug);
    if (existing) throw new ConflictException('Campaign slug already exists');
    return this.repo.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (dto.slug) {
      const existing = await this.repo.findBySlug(dto.slug);
      if (existing && existing.id !== id) throw new ConflictException('Slug already in use');
    }
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    await this.repo.remove(id);
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.cloudinary.uploadImage(file, 'admin/campaigns');
    return { url };
  }

  async addImage(id: string, body: { url: string; alt?: string; sortOrder?: number }) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.repo.addImage(id, body);
  }

  async placeOrder(slug: string, dto: PlaceCampaignOrderDto) {
    const campaign = await this.repo.findBySlug(slug);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'ACTIVE') throw new BadRequestException('This campaign is no longer active');

    // Allow ordering either the primary or second product
    const allowedProductIds = [campaign.productId, campaign.secondProductId].filter(Boolean);
    const selectedProductId = dto.productId && allowedProductIds.includes(dto.productId)
      ? dto.productId
      : campaign.productId;

    // Resolve unit price based on which product was selected
    const isSecond = selectedProductId === campaign.secondProductId;
    const unitPrice = isSecond
      ? (campaign.secondCampaignPrice
          ? Number(campaign.secondCampaignPrice)
          : Number((campaign as any).secondProduct?.price ?? campaign.product.price))
      : (campaign.campaignPrice
          ? Number(campaign.campaignPrice)
          : Number(campaign.product.price));

    const shippingCharge = dto.deliveryZone === 'INSIDE_DHAKA' ? 60 : 120;

    return this.repo.placeOrderWithProductId(
      campaign.id,
      selectedProductId,
      dto,
      unitPrice,
      shippingCharge,
    );
  }

  async getOrders(campaignId: string, page?: string, limit?: string) {
    const campaign = await this.repo.findById(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.repo.findOrders(campaignId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  async getOrderById(orderId: string) {
    const order = await this.repo.findOrderById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAllOrders(page?: string, limit?: string, status?: string, phone?: string) {
    return this.repo.findAllOrders(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
      phone,
    );
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.repo.updateOrderStatus(orderId, status);
  }
}
