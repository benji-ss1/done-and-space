export class LoginDto {
  email: string;
  password: string;
}

export class CreatePropertyDto {
  title: string;
  description?: string;
  listing_type: string;
  property_type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  address?: string;
  city: string;
  province?: string;
  state?: string;
  mandate_type?: string;
  mandate_expiry?: string;
  branch_id?: string;
}

export class UpdatePropertyDto {
  title?: string;
  description?: string;
  listing_type?: string;
  property_type?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  address?: string;
  city?: string;
  province?: string;
  state?: string;
  mandate_type?: string;
  mandate_expiry?: string;
}

export class SearchPropertiesDto {
  listing_type?: string;
  property_type?: string;
  city?: string;
  province?: string;
  area?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  limit?: number;
  offset?: number;
}

export class CreateLeadDto {
  full_name: string;
  email?: string;
  phone?: string;
  source?: string;
  interest_type?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  notes?: string;
  property_id?: string;
  branch_id?: string;
}

export class UpdateLeadDto {
  status?: string;
  notes?: string;
  next_action_date?: string;
  assigned_to?: string;
}

export class LogInteractionDto {
  type: string;
  notes: string;
  outcome?: string;
  new_status?: string;
  next_action_date?: string;
  next_action?: string;
}

export class CreateDealDto {
  property_id: string;
  agent_id: string;
  lead_id?: string;
  deal_type: string;
  agreed_price?: number;
  commission_rate?: number;
  agent_split_percent?: number;
  notes?: string;
  close_date?: string;
}

export class UpdateDealDto {
  stage?: string;
  agreed_price?: number;
  commission_rate?: number;
  agent_split_percent?: number;
  notes?: string;
  close_date?: string;
}
