/**
 * API 에러 타입 및 팩토리
 * 구조화된 에러로 런타임 정합성 확보
 */

import { ApiErrorCode } from './types';

export interface ApiError {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly userMessage: string;
  readonly cause?: unknown;
}

export function createApiError(
  code: ApiErrorCode,
  options: {
    message?: string;
    userMessage: string;
    cause?: unknown;
  }
): ApiError {
  return {
    code,
    message: options.message ?? options.userMessage,
    userMessage: options.userMessage,
    cause: options.cause,
  };
}

/** ApiError인지 타입 가드 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'userMessage' in value &&
    typeof (value as ApiError).userMessage === 'string'
  );
}

/** 알 수 없는 에러를 ApiError로 변환 */
export function toApiError(err: unknown): ApiError {
  if (isApiError(err)) return err;

  const message = err instanceof Error ? err.message : String(err);
  return createApiError('UNKNOWN', {
    message,
    userMessage: '네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해 주세요.',
    cause: err,
  });
}
