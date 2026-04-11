import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreatePropertyDto } from '../dto/all.dto';
import { UpdatePropertyDto } from '../dto/all.dto';
import { SearchPropertiesDto } from '../dto/all.dto';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private readonly supabase: SupabaseService) {}

  // ── PUBLIC: search published listings ──
  async search(filters: SearchPropertiesDto) {
    let query = this.supabase.client
      .from('properties')
      .select(`
        id, reference_no, title, listing_type, property_type,
        price, currency, bedrooms, bathrooms, size_sqm,
        area, city, province, features, status, created_at,
        property_images(url, is_primary, sort_order)
      `)
      .eq('status', 'published');

    if (filters.listing_type) query = query.eq('listing_type', filters.listing_type);
    if (filters.property_type) query = query.eq('property_type', filters.property_type);
    if (filters.city) query = query.ilike('city', `%${filters.city}%`);
    if (filters.province) query = query.eq('province', filters.province);
    if (filters.area) query = query.ilike('area', `%${filters.area}%`);
    if (filters.min_price) query = query.gte('price', filters.min_price);
    if (filters.max_price) query = query.lte('price', filters.max_price);
    if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms);

    const limit = Math.min(filters.limit ?? 20, 50);
    const offset = filters.offset ?? 0;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new InternalServerErrorException(error.message);
    return { data, count, limit, offset };
  }

  // ── PUBLIC: get single published property ──
  async findPublicById(id: string) {
    const { data, error } = await this.supabase.client
      .from('properties')
      .select(`
        *, 
        property_images(*),
        property_documents(id, doc_type, verified),
        users!listed_by(full_name, phone)
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !data) throw new NotFoundException('Property not found');

    // Increment view count
    await this.supabase.client
      .from('properties')
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq('id', id);

    return data;
  }

  // ── ADMIN: get all properties with filters ──
  async findAll(filters: any, user: any) {
    let query = this.supabase.client
      .from('properties')
      .select(`
        id, reference_no, title, listing_type, property_type,
        price, currency, area, city, province, status,
        mandate_type, mandate_expiry, view_count, inquiry_count,
        created_at, updated_at,
        listed_by, approved_by,
        branches(name)
      `);

    // Agents only see their own listings
    if (user.role === 'agent') {
      query = query.eq('listed_by', user.sub);
    } else if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.listing_type) query = query.eq('listing_type', filters.listing_type);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // ── CREATE listing (draft) ──
  async create(dto: CreatePropertyDto, user: any) {
    const insertData = {
      title: dto.title,
      description: dto.description,
      listing_type: dto.listing_type,
      property_type: dto.property_type,
      price: dto.price,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      size_sqm: dto.size_sqm,
      address: dto.address,
      city: dto.city,
      province: dto.province,
      mandate_type: dto.mandate_type,
      mandate_expiry: dto.mandate_expiry || null,
      status: 'draft',
      currency: 'ZMW',
      listed_by: user.sub,
      branch_id: user.branch_id,
    };
    console.log('INSERT PAYLOAD:', JSON.stringify(insertData));
    const { data, error } = await this.supabase.client
      .from('properties')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, 'CREATE_LISTING', 'property', data.id);
    return data;
  }

  // ── UPDATE listing ──
  async update(id: string, dto: UpdatePropertyDto, user: any) {
    const existing = await this.getOwnedOrThrow(id, user);

    // Cannot edit published/approved unless admin
    if (
      ['published', 'approved'].includes(existing.status) &&
      !['super_admin', 'admin', 'manager'].includes(user.role)
    ) {
      throw new ForbiddenException('Cannot edit a published listing. Request review.');
    }

    const { data, error } = await this.supabase.client
      .from('properties')
      .update({ ...dto, status: 'draft' }) // editing resets to draft
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, 'UPDATE_LISTING', 'property', id);
    return data;
  }

  // ── SUBMIT for approval ──
  async submitForApproval(id: string, user: any) {
    const prop = await this.getOwnedOrThrow(id, user);

    if (prop.status !== 'draft') {
      throw new BadRequestException('Only draft listings can be submitted for approval');
    }

    // Basic completeness check
    if (!prop.title || !prop.price || !prop.address) {
      throw new BadRequestException('Listing must have title, price, and address before submission');
    }

    await this.supabase.client
      .from('properties')
      .update({ status: 'pending_review' })
      .eq('id', id);

    await this.audit(user.sub, 'SUBMIT_FOR_APPROVAL', 'property', id);
    return { message: 'Submitted for approval' };
  }

  // ── APPROVE listing (manager+) ──
  async approve(id: string, user: any) {
    const { data: prop } = await this.supabase.client
      .from('properties')
      .select('status, reference_no')
      .eq('id', id)
      .single();

    if (!prop) throw new NotFoundException('Property not found');
    if (prop.status !== 'pending_review') {
      throw new BadRequestException('Only pending_review listings can be approved');
    }

    const ref = prop.reference_no || (await this.generateReference());

    await this.supabase.client
      .from('properties')
      .update({
        status: 'approved',
        reference_no: ref,
        approved_by: user.sub,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id);

    await this.audit(user.sub, 'APPROVE_LISTING', 'property', id);
    return { message: 'Listing approved', reference_no: ref };
  }

  // ── PUBLISH listing (manager+) ──
  async publish(id: string, user: any) {
    const { data: prop } = await this.supabase.client
      .from('properties')
      .select('status')
      .eq('id', id)
      .single();

    if (!prop) throw new NotFoundException('Property not found');
    if (prop.status !== 'approved') {
      throw new BadRequestException('Only approved listings can be published');
    }

    await this.supabase.client
      .from('properties')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id);

    await this.audit(user.sub, 'PUBLISH_LISTING', 'property', id);
    return { message: 'Listing published' };
  }

  // ── REJECT listing ──
  async reject(id: string, reason: string, user: any) {
    await this.supabase.client
      .from('properties')
      .update({ status: 'draft' })
      .eq('id', id);

    await this.audit(user.sub, 'REJECT_LISTING', 'property', id, { reason });
    return { message: 'Listing rejected and returned to draft' };
  }

  // ── Archive listing ──
  async archive(id: string, user: any) {
    await this.supabase.client
      .from('properties')
      .update({ status: 'archived' })
      .eq('id', id);

    await this.audit(user.sub, 'ARCHIVE_LISTING', 'property', id);
    return { message: 'Listing archived' };
  }

  // ── Pending approvals queue ──
  async getPendingApprovals(user: any) {
    let query = this.supabase.client
      .from('properties')
      .select(`
        id, reference_no, title, listing_type, property_type,
        price, currency, area, city, province, created_at,
        users!listed_by(full_name, email),
        property_images(url, is_primary),
        property_documents(id, doc_type, verified)
      `)
      .eq('status', 'pending_review');

    if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // ── Helpers ──
  private async getOwnedOrThrow(id: string, user: any) {
    let query = this.supabase.client
      .from('properties')
      .select('*')
      .eq('id', id);

    if (user.role === 'agent') {
      query = query.eq('listed_by', user.sub);
    }

    const { data, error } = await query.single();
    if (error || !data) throw new NotFoundException('Property not found');
    return data;
  }

  private async generateReference(): Promise<string> {
    const year = new Date().getFullYear();
    const { count } = await this.supabase.client
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .not('reference_no', 'is', null);
    return `DSP-${year}-${String((count ?? 0) + 1).padStart(4, '0')}`;
  }

  private async audit(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    meta?: any,
  ) {
    await this.supabase.client.from('audit_log').insert({
      user_id: userId,
      action,
      entity_type: entity,
      entity_id: entityId,
      new_value: meta,
    });
  }
}
