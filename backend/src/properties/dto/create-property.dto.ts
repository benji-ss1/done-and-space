import { IsString, IsNumber, IsOptional, IsEnum, IsArray, Min, IsDateString } from 'class-validator';

export class CreatePropertyDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(['sale','let']) listing_type: string;
  @IsEnum(['apartment','house','land','commercial','mixed_use','townhouse']) property_type: string;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsNumber() bedrooms?: number;
  @IsOptional() @IsNumber() bathrooms?: number;
  @IsOptional() @IsNumber() size_sqm?: number;
  @IsString() address: string;
  @IsString() area: string;
  @IsString() city: string;
  @IsEnum(['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga']) province: string;
  @IsOptional() @IsEnum(['exclusive','open']) mandate_type?: string;
  @IsOptional() @IsDateString() mandate_expiry?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) features?: string[];
}

export class UpdatePropertyDto extends CreatePropertyDto {}

export class SearchPropertiesDto {
  @IsOptional() listing_type?: string;
  @IsOptional() property_type?: string;
  @IsOptional() city?: string;
  @IsOptional() province?: string;
  @IsOptional() area?: string;
  @IsOptional() min_price?: number;
  @IsOptional() max_price?: number;
  @IsOptional() bedrooms?: number;
  @IsOptional() offset?: number;
  @IsOptional() limit?: number;
}
