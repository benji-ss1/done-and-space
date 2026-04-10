import {
  Injectable, NotFoundException, BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateDealDto } from '../dto/all.dto';

const STAGE_ORDER = [
  'qualification',
  'viewing_scheduled',
  'viewing_done',
  'offer_made',
  'negotiation',
  'under_contract',
  'completed',
];

const STAGE_PROBABILITY: Record<string, number> = {
  qualification: 10,
  viewing_scheduled: 20,
  viewing_done: 35,
  offer_made: 50,
  negotiation: 65,
  under_contract: 85,
  completed: 100,
  fallen_through: 0,
};

@Injectable()
export class DealsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateDealDto, user: any) {
    const probability = STAGE_PROBABILITY['qualification'];

    const { data, error } = await this.supabase.client
      .from('deals')
      .insert({
        ...dto,
        expected_close_date: dto.expected_close_date || null,
        stage: 'qualification',
        probability,
        currency: 'ZMW',
        created_by: user.sub,
        commission_rate: dto.commission_rate ?? 5.00,
        agent_split_percent: 50.00,
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // Link the lead to this property if provided
    if (dto.lead_id) {
      await this.supabase.client
        .from('leads')
        .update({ status: 'converted', property_id: dto.property_id })
        .eq('id', dto.lead_id);
    }

    await this.audit(user.sub, 'CREATE_DEAL', 'deal', data.id);
    return data;
  }

  async findAll(user: any) {
    let query = this.supabase.client
      .from('deals')
      .select(`
        id, reference_no, deal_type, stage, agreed_price, currency,
        commission_rate, commission_amount, agent_commission, company_commission,
        commission_status, probability, expected_close_date, actual_close_date,
        created_at, updated_at,
        properties(id, reference_no, title, city, area),
        users!agent_id(id, full_name),
        leads(id, full_name, phone)
      `);

    if (user.role === 'agent') {
      query = query.eq('agent_id', user.sub);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.client
      .from('deals')
      .select(`
        *,
        properties(*, property_images(url, is_primary)),
        users!agent_id(id, full_name, phone, email),
        leads(id, full_name, phone, email),
        viewings(id, scheduled_at, status, outcome, client_feedback)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Deal not found');
    return data;
  }

  async advanceStage(id: string, newStage: string, notes: string, user: any) {
    const { data: deal } = await this.supabase.client
      .from('deals')
      .select('stage, agreed_price')
      .eq('id', id)
      .single();

    if (!deal) throw new NotFoundException('Deal not found');

    const currentIdx = STAGE_ORDER.indexOf(deal.stage);
    const newIdx = STAGE_ORDER.indexOf(newStage);

    if (newStage !== 'fallen_through' && newIdx <= currentIdx) {
      throw new BadRequestException(
        `Cannot move deal from ${deal.stage} to ${newStage}`,
      );
    }

    const updates: any = {
      stage: newStage,
      probability: STAGE_PROBABILITY[newStage] ?? 0,
      notes: notes || undefined,
      updated_at: new Date().toISOString(),
    };

    if (newStage === 'completed') {
      updates.actual_close_date = new Date().toISOString().split('T')[0];
      // Update property status
      await this.supabase.client
        .from('deals')
        .select('deal_type, property_id')
        .eq('id', id)
        .then(async (res: any) => { const d = res.data;
          if (d) {
            await this.supabase.client
              .from('properties')
              .update({ status: d.deal_type === 'sale' ? 'sold' : 'let' })
              .eq('id', d.property_id);
          }
        });
    }

    const { data, error } = await this.supabase.client
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, `DEAL_STAGE_${newStage.toUpperCase()}`, 'deal', id);
    return data;
  }

  async updatePrice(id: string, agreedPrice: number, user: any) {
    const { data, error } = await this.supabase.client
      .from('deals')
      .update({ agreed_price: agreedPrice })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    await this.audit(user.sub, 'UPDATE_DEAL_PRICE', 'deal', id, { agreed_price: agreedPrice });
    return data;
  }

  async approveCommission(id: string, user: any) {
    const { data, error } = await this.supabase.client
      .from('deals')
      .update({ commission_status: 'approved' })
      .eq('id', id)
      .eq('stage', 'completed')
      .select()
      .single();

    if (error || !data) throw new BadRequestException('Deal must be completed before approving commission');
    await this.audit(user.sub, 'APPROVE_COMMISSION', 'deal', id);
    return data;
  }

  async getPipelineSummary(user: any) {
    let query = this.supabase.client
      .from('deals')
      .select('stage, deal_type, commission_amount, agreed_price, commission_status');

    if (user.role === 'agent') query = query.eq('agent_id', user.sub);

    const { data, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);

    const stageCounts: Record<string, number> = {};
    let pipelineValue = 0;
    let commissionPipeline = 0;
    let commissionEarned = 0;

    for (const deal of data || []) {
      stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
      if (!['completed', 'fallen_through'].includes(deal.stage)) {
        pipelineValue += Number(deal.agreed_price || 0);
        commissionPipeline += Number(deal.commission_amount || 0);
      }
      if (deal.stage === 'completed' && deal.commission_status === 'approved') {
        commissionEarned += Number(deal.commission_amount || 0);
      }
    }

    return {
      total_deals: data?.length ?? 0,
      by_stage: stageCounts,
      pipeline_value: pipelineValue,
      commission_pipeline: commissionPipeline,
      commission_earned: commissionEarned,
    };
  }

  private async audit(userId: string, action: string, entity: string, entityId: string, meta?: any) {
    await this.supabase.client.from('audit_log').insert({
      user_id: userId, action, entity_type: entity, entity_id: entityId, new_value: meta,
    });
  }
}
