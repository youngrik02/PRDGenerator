/**
 * Intake API 서비스
 * 타입 안전 + 구조화된 에러 처리
 */

import type { IntakesInsert } from '@/types/supabase';
import type { IntakeStatus } from '@/types/supabase';
import { getSupabaseClient } from './client';
import { createApiError, toApiError } from './errors';
import {
  ApiErrorCode,
  ApiResult,
  PostgresErrorCode,
  type ApiError,
} from './types';
import {
  INTAKE_QUESTION_IDS,
  QUESTION_ID_TO_COLUMN,
  type IntakeQuestionId,
} from './question-mapping';

/** SaveIntake 입력 (Map 또는 Record 지원) */
export interface SaveIntakeInput {
  responses: Map<string, string> | Partial<Record<IntakeQuestionId, string>>;
  projectName?: string;
  status?: IntakeStatus;
}

/** SaveIntake 성공 응답 */
export interface SaveIntakeSuccess {
  intakeId: string;
}

/**
 * Map/Record → IntakesInsert 변환 (타입 안전)
 */
function toIntakesInsert(
  input: SaveIntakeInput,
  userId: string | null
): IntakesInsert {
  const responses =
    input.responses instanceof Map
      ? Object.fromEntries(input.responses) as Partial<Record<IntakeQuestionId, string>>
      : input.responses;

  const projectName = input.projectName ?? 'Untitled Project';
  const status = input.status ?? 'completed';

  const insert: IntakesInsert = {
    project_name: projectName,
    target_audience: '',
    core_problem: '',
    key_features: '',
    technical_constraints: '',
    success_metric: '',
    status,
    user_id: userId,
  };

  for (const qid of INTAKE_QUESTION_IDS) {
    const col = QUESTION_ID_TO_COLUMN[qid];
    const val = responses[qid] ?? '';
    insert[col] = typeof val === 'string' ? val : '';
  }

  return insert;
}

/**
 * 필수 필드 검증
 */
function validateInsert(
  insert: IntakesInsert
): ApiError | null {
  const required: Array<keyof Pick<
    IntakesInsert,
    'project_name' | 'target_audience' | 'core_problem' | 'key_features' | 'technical_constraints' | 'success_metric'
  >> = [
    'project_name',
    'target_audience',
    'core_problem',
    'key_features',
    'technical_constraints',
    'success_metric',
  ];

  for (const key of required) {
    const val = insert[key];
    if (typeof val !== 'string' || val.trim().length === 0) {
      return createApiError(ApiErrorCode.MISSING_REQUIRED_FIELD, {
        message: `Missing required field: ${key}`,
        userMessage: '필수 항목이 비어 있습니다. 모든 질문에 답변해 주세요.',
      });
    }
  }
  return null;
}

/**
 * PostgREST 에러 → ApiError 매핑
 */
function mapPostgresError(err: { code?: string; message?: string }): ApiError {
  const code = err.code;
  const message = err.message ?? 'Unknown database error';

  if (code === PostgresErrorCode.PGRST301) {
    return createApiError(ApiErrorCode.NETWORK_ERROR, {
      message,
      userMessage: '네트워크 연결을 확인해 주세요.',
      cause: err,
    });
  }

  if (code === PostgresErrorCode['23505']) {
    return createApiError(ApiErrorCode.DB_UNIQUE_VIOLATION, {
      message,
      userMessage: '이미 존재하는 프로젝트입니다.',
      cause: err,
    });
  }

  if (code === PostgresErrorCode['23503']) {
    return createApiError(ApiErrorCode.DB_FOREIGN_KEY_VIOLATION, {
      message,
      userMessage: '참조 데이터가 유효하지 않습니다.',
      cause: err,
    });
  }

  return createApiError(ApiErrorCode.DB_INSERT_FAILED, {
    message,
    userMessage: '저장에 실패했습니다. 다시 시도해 주세요.',
    cause: err,
  });
}

/**
 * Intake 저장
 */
export async function saveIntake(
  input: SaveIntakeInput
): Promise<ApiResult<SaveIntakeSuccess, ApiError>> {
  try {
    const supabase = getSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return {
        ok: false,
        error: createApiError(ApiErrorCode.AUTH_FAILED, {
          message: authError.message,
          userMessage: '로그인 정보를 확인할 수 없습니다.',
          cause: authError,
        }),
      };
    }

    const insert = toIntakesInsert(input, user?.id ?? null);
    const validationError = validateInsert(insert);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    const { data, error } = await supabase
      .from('intakes')
      .insert(insert)
      .select('id')
      .single();

    if (error) {
      return {
        ok: false,
        error: mapPostgresError(error),
      };
    }

    if (!data?.id) {
      return {
        ok: false,
        error: createApiError(ApiErrorCode.DB_INSERT_FAILED, {
          message: 'No id returned from insert',
          userMessage: '저장 결과를 확인할 수 없습니다.',
        }),
      };
    }

    return { ok: true, data: { intakeId: data.id } };
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && 'userMessage' in err) {
      return { ok: false, error: err as ApiError };
    }
    return {
      ok: false,
      error: toApiError(err),
    };
  }
}
