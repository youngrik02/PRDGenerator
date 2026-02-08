/**
 * @deprecated Use '@/app/lib/api' instead.
 * 하위 호환용 re-export
 */
export {
  saveIntake,
  getSupabaseClient as getSupabase,
} from './api';
export type { SaveIntakeInput, SaveIntakeSuccess } from './api';
