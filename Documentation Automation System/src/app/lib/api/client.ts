/**
 * Supabase 클라이언트 싱글톤
 * 환경 변수 런타임 검증으로 타입·정합성 확보
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { createApiError } from './errors';
import { ApiErrorCode } from './types';

interface SupabaseEnv {
  url: string;
  anonKey: string;
}

function validateEnv(): SupabaseEnv {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (typeof url !== 'string' || url.trim().length === 0) {
    throw createApiError(ApiErrorCode.ENV_NOT_CONFIGURED, {
      message: 'VITE_SUPABASE_URL is not configured',
      userMessage: 'Supabase URL이 설정되지 않았습니다. .env 파일을 확인해 주세요.',
    });
  }

  if (typeof anonKey !== 'string' || anonKey.trim().length === 0) {
    throw createApiError(ApiErrorCode.ENV_NOT_CONFIGURED, {
      message: 'VITE_SUPABASE_ANON_KEY is not configured',
      userMessage: 'Supabase API 키가 설정되지 않았습니다. .env 파일을 확인해 주세요.',
    });
  }

  return { url, anonKey };
}

let instance: SupabaseClient<Database> | null = null;

/** 타입 안전한 Supabase 클라이언트 반환 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!instance) {
    const { url, anonKey } = validateEnv();
    instance = createClient<Database>(url, anonKey);
  }
  return instance;
}
