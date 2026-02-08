-- Documentation Automation System: Initial Schema
-- intakes + brd_results (1:1)

-- ─── intakes 테이블 ───
CREATE TABLE public.intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  project_name TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  core_problem TEXT NOT NULL,
  key_features TEXT NOT NULL,
  technical_constraints TEXT NOT NULL,
  success_metric TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in-progress', 'completed')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  CONSTRAINT project_name_not_empty CHECK (char_length(trim(project_name)) >= 1),
  CONSTRAINT target_audience_not_empty CHECK (char_length(trim(target_audience)) >= 1),
  CONSTRAINT core_problem_not_empty CHECK (char_length(trim(core_problem)) >= 1),
  CONSTRAINT key_features_not_empty CHECK (char_length(trim(key_features)) >= 1),
  CONSTRAINT technical_constraints_not_empty CHECK (char_length(trim(technical_constraints)) >= 1),
  CONSTRAINT success_metric_not_empty CHECK (char_length(trim(success_metric)) >= 1)
);

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER intakes_updated_at
  BEFORE UPDATE ON public.intakes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 인덱스
CREATE INDEX idx_intakes_status ON public.intakes(status);
CREATE INDEX idx_intakes_created_at ON public.intakes(created_at DESC);
CREATE INDEX idx_intakes_user_id ON public.intakes(user_id);

-- ─── brd_results 테이블 (1:1 with intakes) ───
CREATE TABLE public.brd_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID NOT NULL UNIQUE REFERENCES public.intakes(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  document_url TEXT,
  document_content TEXT,
  generation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (generation_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  metadata JSONB
);

CREATE TRIGGER brd_results_updated_at
  BEFORE UPDATE ON public.brd_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_brd_results_intake_id ON public.brd_results(intake_id);
CREATE INDEX idx_brd_results_status ON public.brd_results(generation_status);

-- ─── RLS 정책 ───
ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brd_results ENABLE ROW LEVEL SECURITY;

-- intakes: anon/authenticated insert, select own
CREATE POLICY "Allow anon insert intakes"
  ON public.intakes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon select intakes"
  ON public.intakes FOR SELECT
  TO anon, authenticated
  USING (true);

-- brd_results: anon/authenticated insert/select/update
CREATE POLICY "Allow anon insert brd_results"
  ON public.brd_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon select brd_results"
  ON public.brd_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon update brd_results"
  ON public.brd_results FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
