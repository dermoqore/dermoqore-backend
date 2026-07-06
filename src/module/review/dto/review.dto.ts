import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class UpdateReviewStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'PENDING' | 'APPROVED' | 'INACTIVE';
}
