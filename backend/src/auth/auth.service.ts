import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../database/supabase.service';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const { data: user, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !user) return null;

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;

    return user;
  }

  async login(user: any, ipAddress?: string) {
    const tokens = await this.generateTokens(user);

    // Store refresh token hash
    const tokenHash = createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');

    await this.supabase.client.from('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      ip_address: ipAddress,
    });

    // Update last login
    await this.supabase.client
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Audit
    await this.audit(user.id, 'LOGIN', 'user', user.id, ipAddress);

    const { password_hash, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refresh(refreshToken: string, ipAddress?: string) {
    const tokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const { data: stored, error } = await this.supabase.client
      .from('refresh_tokens')
      .select('*, users(*)')
      .eq('token_hash', tokenHash)
      .eq('revoked', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !stored) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!stored.users?.is_active) {
      throw new ForbiddenException('Account is disabled');
    }

    // Revoke old token (rotation)
    await this.supabase.client
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('id', stored.id);

    const tokens = await this.generateTokens(stored.users);

    // Store new refresh token
    const newHash = createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');

    await this.supabase.client.from('refresh_tokens').insert({
      user_id: stored.users.id,
      token_hash: newHash,
      expires_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      ip_address: ipAddress,
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.supabase.client
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('user_id', userId)
      .eq('revoked', false);

    await this.audit(userId, 'LOGOUT', 'user', userId);
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('id,email,full_name,phone,role,branch_id,last_login,created_at,branches(name,province)')
      .eq('id', userId)
      .single();

    if (error || !data) throw new UnauthorizedException('User not found');
    return data;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      branch_id: user.branch_id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
      }),
      Promise.resolve(randomBytes(40).toString('hex')),
    ]);

    return { accessToken, refreshToken };
  }

  private async audit(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    ip?: string,
  ) {
    await this.supabase.client.from('audit_log').insert({
      user_id: userId,
      action,
      entity_type: entity,
      entity_id: entityId,
      ip_address: ip,
    });
  }
}
