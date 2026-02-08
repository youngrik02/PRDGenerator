/**
 * API 서비스 레이어
 * @example
 * import { saveIntake } from '@/app/lib/api';
 * const result = await saveIntake({ responses, projectName: 'My Project' });
 * if (result.ok) console.log(result.data.intakeId);
 * else toast.error(result.error.userMessage);
 */

export { saveIntake } from './intake-service';
export type { SaveIntakeInput, SaveIntakeSuccess } from './intake-service';
export { getSupabaseClient } from './client';
export { createApiError, isApiError, toApiError } from './errors';
export type { ApiError } from './errors';
export { ApiErrorCode, PostgresErrorCode } from './types';
export type { ApiResult, ApiErrorCode as ApiErrorCodeType } from './types';
export { INTAKE_QUESTION_IDS, QUESTION_ID_TO_COLUMN } from './question-mapping';
export type { IntakeQuestionId, IntakeResponses } from './question-mapping';
