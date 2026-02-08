# Supabase 마이그레이션

## 스키마 적용 방법

### 방법 1: Supabase SQL Editor (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **SQL Editor** 메뉴
3. `migrations/20250207000000_initial_schema.sql` 내용 전체 복사 후 실행

### 방법 2: Supabase CLI

```bash
# Supabase CLI 설치 후 프로젝트 연결
supabase link --project-ref <your-project-ref>
supabase db push
```
