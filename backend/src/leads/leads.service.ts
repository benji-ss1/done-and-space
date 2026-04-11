import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateLeadDto } from '../dto/all.dto';
import { UpdateLeadDto } from '../dto/all.dto';
import { LogInteractionDto } from '../dto/all.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  // ── ADMIN: create lead from dashboard ──
  async create(dto: any, user: any) {
    const insertData: any = {
      full_name: dto.full_name,
      phone: dto.phone || dto.phone_number,
      status: 'new',
      assigned_to: user.sub,
    };
    if (dto.email) insertData.email = dto.email;
    if (dto.source || dto.lead_source) insertData.source = dto.source || dto.lead_source;
    if (dto.interest_type) insertData.interest_type = dto.interest_type;
    if (dto.budget_min) insertData.budget_min = Number(dto.budget_min);
    if (dto.budget_max) insertData.budget_max = Number(dto.budget_max);
    if (dto.preferred_area || dto.preferred_location) {
      insertData.preferred_area = dto.preferred_area || dto.preferred_location;
    }
    if (dto.notes) insertData.notes = dto.notes;

    console.log('LEAD CREATE PAYLOAD:', JSON.stringify(insertData));
    const { data, error } = await this.supabase.client
      .from('leads')
      .insert(insertData)
      .select()
      .single();

    console.log('LEAD INSERT RESULT:', JSON.stringify({ data, error }));
    if (error) {
      this.logger.error('Lead create error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  // ── PUBLIC: capture inquiry from website ──
  async createPublic(dto: CreateLeadDto) {
    console.log('LEAD PAYLOAD:', JSON.stringify(dto));
    const { data, error } = await this.supabase.client
      .from('leads')
      .insert({
        ...dto,
        status: 'new',
        source: dto.source || 'website',
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // Auto-assign to least loaded agent
    await this.autoAssign(data.id, data.branch_id);

    return { message: 'Inquiry received. Our team will contact you shortly.' };
  }

  // ── ADMIN: get all leads ──
  async findAll(filters: any, user: any) {
    let query = this.supabase.client
      .from('leads')
      .select(`
        id, full_name, email, phone, source, interest_type,
        budget_min, budget_max, preferred_area, preferred_province,
        status, next_action_date, created_at, updated_at,
        users!assigned_to(id, full_name),
        properties(id, title, reference_no),
        branches(name)
      `);

    // Agents see only their assigned leads
    if (user.role === 'agent') {
      query = query.eq('assigned_to', user.sub);
    } else if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters.interest_type) query = query.eq('interest_type', filters.interest_type);
    if (filters.source) query = query.eq('source', filters.source);

    // Overdue follow-ups
    if (filters.overdue === 'true') {
      query = query.lt('next_action_date', new Date().toISOString().split('T')[0]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // ── Get single lead with full history ──
  async findOne(id: string, user: any) {
    let query = this.supabase.client
      .from('leads')
      .select(`
        *,
        users!assigned_to(id, full_name, phone, email),
        properties(id, title, reference_no, price, city),
        branches(name),
        lead_interactions(
          id, type, notes, outcome, next_action, next_action_date,
          logged_by, interaction_date,
          users!logged_by(full_name)
        )
      `)
      .eq('id', id);

    if (user.role === 'agent') {
      query = query.eq('assigned_to', user.sub);
    }

    const { data, error } = await query.single();
    if (error || !data) throw new NotFoundException('Lead not found');
    return data;
  }

  // ── Update lead ──
  async update(id: string, dto: UpdateLeadDto, user: any) {
    const { data, error } = await this.supabase.client
      .from('leads')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, 'UPDATE_LEAD', 'lead', id);
    return data;
  }

  // ── Assign lead to agent ──
  async assign(leadId: string, agentId: string, user: any) {
    const { data, error } = await this.supabase.client
      .from('leads')
      .update({ assigned_to: agentId, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, 'ASSIGN_LEAD', 'lead', leadId, { agent_id: agentId });
    return data;
  }

  // ── Log interaction (call, email, viewing note, etc) ──
  async logInteraction(leadId: string, dto: LogInteractionDto, user: any) {
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (dto.new_status) updates.status = dto.new_status;
    if (dto.next_action_date) updates.next_action_date = dto.next_action_date;

    const [interactionResult] = await Promise.all([
      this.supabase.client.from('lead_interactions').insert({
        lead_id: leadId,
        type: dto.type,
        notes: dto.notes,
        outcome: dto.outcome,
        next_action: dto.next_action,
        next_action_date: dto.next_action_date || null,
        logged_by: user.sub,
      }).select().single(),
      this.supabase.client.from('leads').update(updates).eq('id', leadId),
    ]);

    if (interactionResult.error) {
      throw new InternalServerErrorException(interactionResult.error.message);
    }

    return interactionResult.data;
  }

  // ── Pipeline stats ──
  async getStats(user: any) {
    let query = this.supabase.client
      .from('leads')
      .select('status, source, interest_type, created_at');

    if (user.role === 'agent') {
      query = query.eq('assigned_to', user.sub);
    } else if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    const { data, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);

    const statusCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    for (const lead of data || []) {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
      sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
    }

    return {
      total: data?.length ?? 0,
      by_status: statusCounts,
      by_source: sourceCounts,
    };
  }

  // ── Auto-assign to least loaded agent ──
  private async autoAssign(leadId: string, branchId?: string) {
    try {
      const { data } = await this.supabase.client
        .rpc('get_least_loaded_agent', { p_branch_id: branchId });

      if (data && data.length > 0) {
        await this.supabase.client
          .from('leads')
          .update({ assigned_to: data[0].id })
          .eq('id', leadId);
      }
    } catch (e) {
      this.logger.warn(`Auto-assign failed for lead ${leadId}: ${e.message}`);
    }
  }

  private async audit(userId: string, action: string, entity: string, entityId: string, meta?: any) {
    await this.supabase.client.from('audit_log').insert({
      user_id: userId, action, entity_type: entity, entity_id: entityId, new_value: meta,
    });
  }
}
