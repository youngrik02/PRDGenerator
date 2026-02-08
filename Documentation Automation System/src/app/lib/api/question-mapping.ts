/**
 * 질문 ID ↔ DB 컬럼 타입 안전 매핑
 * constants.SEVEN_QUESTIONS와 스키마 정합성 보장
 */

import type { IntakesInsert } from '@/types/supabase';

/** DB에 저장하는 5개 질문 ID (타입 리터럴) */
export const INTAKE_QUESTION_IDS = [
  'q1-business-impact',
  'q2-user-value',
  'q3-technical-scope',
  'q5-dependencies',
  'q4-success-metrics',
] as const;

export type IntakeQuestionId = (typeof INTAKE_QUESTION_IDS)[number];

/** DB intakes 테이블 인서트용 필수 텍스트 컬럼 */
export type IntakeTextColumn = keyof Pick<
  IntakesInsert,
  'project_name' | 'target_audience' | 'core_problem' | 'key_features' | 'technical_constraints' | 'success_metric'
>;

/** 질문 ID → DB 컬럼 매핑 (컴파일 타임 검증) */
export const QUESTION_ID_TO_COLUMN: Record<IntakeQuestionId, IntakeTextColumn> = {
  'q1-business-impact': 'core_problem',
  'q2-user-value': 'target_audience',
  'q3-technical-scope': 'key_features',
  'q5-dependencies': 'technical_constraints',
  'q4-success-metrics': 'success_metric',
} as const;

/** IntakeResponses: 질문 ID → 답변 (타입 안전) */
export type IntakeResponses = Partial<Record<IntakeQuestionId, string>>;
