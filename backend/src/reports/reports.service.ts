import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class ReportsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getDashboard(user: any) {
    const branchId = user.role === 'super_admin' ? null : user.branch_id;

    const { data, error } = await this.supabase.client
      .rpc('get_dashboard_stats', { p_branch_id: branchId });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async getLeadReport(user: any) {
    let query = this.supabase.client
      .from('leads')
      .select('id, status, source, interest_type, created_at, assigned_to, users!assigned_to(full_name)');

    if (user.role === 'agent') query = query.eq('assigned_to', user.sub);
    else if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(500);
    if (error) throw new InternalServerErrorException(error.message);

    // Aggregate
    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byAgent: Record<string, { name: string; count: number }> = {};

    for (const lead of data || []) {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;

      if (lead.assigned_to) {
        const agentName = (lead.users as any)?.full_name || 'Unassigned';
        if (!byAgent[lead.assigned_to]) {
          byAgent[lead.assigned_to] = { name: agentName, count: 0 };
        }
        byAgent[lead.assigned_to].count++;
      }
    }

    return {
      total: data?.length ?? 0,
      by_status: byStatus,
      by_source: bySource,
      by_agent: Object.values(byAgent).sort((a, b) => b.count - a.count),
    };
  }

  async getAgentPerformance(user: any) {
    const { data: agents, error } = await this.supabase.client
      .from('users')
      .select('id, full_name, branch_id, branches(name)')
      .eq('role', 'agent')
      .eq('is_active', true);

    if (error) throw new InternalServerErrorException(error.message);

    const results = await Promise.all(
      (agents || []).map(async (agent) => {
        const [leadsRes, dealsRes] = await Promise.all([
          this.supabase.client
            .from('leads')
            .select('id, status', { count: 'exact' })
            .eq('assigned_to', agent.id),
          this.supabase.client
            .from('deals')
            .select('id, stage, agent_commission, commission_status')
            .eq('agent_id', agent.id),
        ]);

        const leads = leadsRes.data || [];
        const deals = dealsRes.data || [];

        const completedDeals = deals.filter((d) => d.stage === 'completed');
        const commissionEarned = completedDeals
          .filter((d) => d.commission_status === 'approved')
          .reduce((sum, d) => sum + Number(d.agent_commission || 0), 0);

        return {
          agent: {
            id: agent.id,
            name: agent.full_name,
            branch: (agent.branches as any)?.name,
          },
          leads: {
            total: leads.length,
            hot: leads.filter((l) => l.status === 'hot').length,
            converted: leads.filter((l) => l.status === 'converted').length,
          },
          deals: {
            total: deals.length,
            active: deals.filter((d) => !['completed', 'fallen_through'].includes(d.stage)).length,
            completed: completedDeals.length,
          },
          commission_earned_zmw: commissionEarned,
        };
      }),
    );

    return results.sort((a, b) => b.deals.completed - a.deals.completed);
  }

  async getListingsReport(user: any) {
    let query = this.supabase.client
      .from('properties')
      .select('id, status, listing_type, property_type, city, province, price, view_count, inquiry_count, created_at');

    if (user.branch_id && user.role !== 'super_admin') {
      query = query.eq('branch_id', user.branch_id);
    }

    const { data, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);

    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byProvince: Record<string, number> = {};

    for (const p of data || []) {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
      byType[p.listing_type] = (byType[p.listing_type] || 0) + 1;
      byProvince[p.province] = (byProvince[p.province] || 0) + 1;
    }

    return {
      total: data?.length ?? 0,
      by_status: byStatus,
      by_type: byType,
      by_province: byProvince,
      most_viewed: (data || [])
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, 10)
        .map((p) => ({ id: p.id, city: p.city, views: p.view_count, price: p.price })),
    };
  }
}
