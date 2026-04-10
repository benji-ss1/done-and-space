import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['for_sale', 'to_let'])
  listing_type: string;

  @IsIn(['house', 'apartment', 'land', 'commercial', 'office'])
  property_type: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size_sqm?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  mandate_type?: string;

  @IsOptional()
  @IsString()
  mandate_expiry?: string;
}
