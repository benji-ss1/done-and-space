import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum ListingType {
  FOR_SALE = 'for_sale',
  TO_LET = 'to_let',
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  OFFICE = 'office',
}

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ListingType)
  listing_type: ListingType;

  @IsEnum(PropertyType)
  property_type: PropertyType;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
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
  @IsDateString()
  mandate_expiry?: string;
}
