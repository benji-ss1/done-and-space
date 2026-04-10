import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async getAll(requestingUser: any) {
    const query = this.supabase.client.from('users').select('id,email,full_name,phone,role,is_active,branch_id,created_at').order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(dto: any, requestingUser: any) {
    const { data: existing } = await this.supabase.client.from('users').select('id').eq('email', dto.email.toLowerCase()).single();
    if (existing) throw new ConflictException('A user with this email already exists.');
    const password_hash = await bcrypt.hash(dto.password, 10);
    const { data, error } = await this.supabase.client.from('users').insert({
      email: dto.email.toLowerCase(), password_hash, full_name: dto.full_name,
      phone: dto.phone, role: dto.role || 'staff', is_active: true, branch_id: dto.branch_id || null,
    }).select('id,email,full_name,phone,role,is_active,created_at').single();
    if (error) throw new InternalServerErrorException(error.message);
    await this.supabase.client.from('audit_log').insert({ user_id: requestingUser.sub, action: 'CREATE_USER', entity_type: 'user', entity_id: data.id, new_value: { email: data.email, role: data.role } });
    return data;
  }

  async update(id: string, dto: any) {
    const updates: any = {};
    if (dto.is_active !== undefined) updates.is_active = dto.is_active;
    if (dto.role) updates.role = dto.role;
    if (dto.phone) updates.phone = dto.phone;
    const { data, error } = await this.supabase.client.from('users').update(updates).eq('id', id).select().single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
