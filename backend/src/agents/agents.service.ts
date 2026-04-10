import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class AgentsService {
  constructor(private readonly supabase: SupabaseService) {}

  async apply(dto: any) {
    const { error } = await this.supabase.client.from('agent_applications').insert(dto);
    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Application received. We will be in touch.' };
  }

  async getApplications(params: any) {
    let query = this.supabase.client.from('agent_applications').select('*');
    if (params.status) query = query.eq('status', params.status);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async updateStatus(id: string, status: string, notes: string, userId: string) {
    const { data, error } = await this.supabase.client
      .from('agent_applications')
      .update({ status, notes, reviewed_by: userId, reviewed_at: new Date() })
      .eq('id', id).select().single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
