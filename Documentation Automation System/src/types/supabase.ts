/**
 * Supabase Database 타입 정의
 * DB 스키마 변경 시 이 파일을 수동 또는 supabase gen types로 동기화
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type IntakeStatus = 'draft' | 'in-progress' | 'completed';
export type BrdGenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ─── Row Types (SELECT 결과) ───
export interface IntakesRow {
  id: string;
  created_at: string;
  updated_at: string;
  project_name: string;
  target_audience: string;
  core_problem: string;
  key_features: string;
  technical_constraints: string;
  success_metric: string;
  status: IntakeStatus;
  user_id: string | null;
}

export interface BrdResultsRow {
  id: string;
  intake_id: string;
  created_at: string;
  updated_at: string;
  document_url: string | null;
  document_content: string | null;
  generation_status: BrdGenerationStatus;
  error_message: string | null;
  metadata: Json | null;
}

// ─── Insert Types ───
export interface IntakesInsert {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_name: string;
  target_audience: string;
  core_problem: string;
  key_features: string;
  technical_constraints: string;
  success_metric: string;
  status?: IntakeStatus;
  user_id?: string | null;
}

export interface BrdResultsInsert {
  id?: string;
  intake_id: string;
  created_at?: string;
  updated_at?: string;
  document_url?: string | null;
  document_content?: string | null;
  generation_status?: BrdGenerationStatus;
  error_message?: string | null;
  metadata?: Json | null;
}

// ─── Update Types ───
export interface IntakesUpdate {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_name?: string;
  target_audience?: string;
  core_problem?: string;
  key_features?: string;
  technical_constraints?: string;
  success_metric?: string;
  status?: IntakeStatus;
  user_id?: string | null;
}

export interface BrdResultsUpdate {
  document_url?: string | null;
  document_content?: string | null;
  generation_status?: BrdGenerationStatus;
  error_message?: string | null;
  metadata?: Json | null;
}

// ─── Database Schema (createClient 제네릭용) ───
export interface Database {
  public: {
    Tables: {
      intakes: {
        Row: IntakesRow;
        Insert: IntakesInsert;
        Update: IntakesUpdate;
      };
      brd_results: {
        Row: BrdResultsRow;
        Insert: BrdResultsInsert;
        Update: BrdResultsUpdate;
      };
    };
  };
}
