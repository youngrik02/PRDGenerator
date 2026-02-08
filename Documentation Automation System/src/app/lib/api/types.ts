/**
 * API 서비스 레이어 공통 타입
 * any 금지, Strict Mode 준수
 */

/** API 결과: 성공 시 data, 실패 시 error */
export type ApiResult<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/** 에러 코드 상수 (매직 스트링 제거) */
export const ApiErrorCode = {
  // 환경/설정
  ENV_NOT_CONFIGURED: 'ENV_NOT_CONFIGURED',

  // 인증
  AUTH_FAILED: 'AUTH_FAILED',

  // 유효성 검증
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // 네트워크/인프라
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // DB/Postgres
  DB_INSERT_FAILED: 'DB_INSERT_FAILED',
  DB_UNIQUE_VIOLATION: 'DB_UNIQUE_VIOLATION',
  DB_FOREIGN_KEY_VIOLATION: 'DB_FOREIGN_KEY_VIOLATION',

  // 기타
  UNKNOWN: 'UNKNOWN',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/** PostgREST/Supabase 에러 코드 매핑 */
export const PostgresErrorCode = {
  PGRST301: 'PGRST301', // Connection/network
  PGRST116: 'PGRST116', // No rows returned
  '23505': '23505', // unique_violation
  '23503': '23503', // foreign_key_violation
} as const;