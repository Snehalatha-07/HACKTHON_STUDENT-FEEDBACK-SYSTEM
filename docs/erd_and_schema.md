# ER Diagram & Database Schema

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : defines
    USERS ||--o{ FEEDBACK_RESPONSES : submits
    COURSES ||--o{ FEEDBACK_FORMS : targets
    INSTRUCTORS ||--o{ COURSES : teaches
    FEEDBACK_FORMS ||--o{ QUESTIONS : contains
    QUESTIONS ||--o{ QUESTION_OPTIONS : has
    FEEDBACK_RESPONSES ||--o{ RESPONSE_ANSWERS : contains
    QUESTIONS ||--o{ RESPONSE_ANSWERS : answered_by

    USERS {
      uuid id PK
      string name
      string email
      string password_hash
      boolean is_active
    }

    ROLES {
      uuid id PK
      string name
    }

    COURSES {
      uuid id PK
      string code
      string name
      uuid instructor_id FK
    }

    INSTRUCTORS {
      uuid id PK
      string name
      string email
    }

    FEEDBACK_FORMS {
      uuid id PK
      string title
      text description
      enum target_type (course|instructor)
      uuid target_id
      boolean is_active
    }

    QUESTIONS {
      uuid id PK
      uuid form_id FK
      enum type (rating,multiple_choice,text,yes_no)
      text question
      jsonb metadata
    }

    QUESTION_OPTIONS {
      uuid id PK
      uuid question_id FK
      string option_text
      int sort_order
    }

    FEEDBACK_RESPONSES {
      uuid id PK
      uuid form_id FK
      uuid course_id FK
      uuid user_id FK NULL
      boolean anonymous
      timestamp submitted_at
    }

    RESPONSE_ANSWERS {
      uuid id PK
      uuid response_id FK
      uuid question_id FK
      text answer_text
      numeric answer_number
      jsonb answer_meta
    }

    AUDIT_LOGS {
      uuid id PK
      string action
      uuid actor_id FK
      jsonb details
      timestamp created_at
    }

```

## SQL DDL (Postgres)

```sql
-- Users and roles
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

CREATE TABLE user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Courses / Instructors
CREATE TABLE instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text
);

CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text,
  name text NOT NULL,
  instructor_id uuid REFERENCES instructors(id)
);

-- Forms and questions
CREATE TABLE feedback_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  target_type text,
  target_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES feedback_forms(id) ON DELETE CASCADE,
  type text NOT NULL,
  question text NOT NULL,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  option_text text,
  sort_order int
);

-- Responses and answers
CREATE TABLE feedback_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES feedback_forms(id) ON DELETE SET NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  anonymous boolean DEFAULT false,
  submitted_at timestamptz DEFAULT now()
);

CREATE TABLE response_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid REFERENCES feedback_responses(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE SET NULL,
  answer_text text,
  answer_number numeric,
  answer_meta jsonb
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor_id uuid REFERENCES users(id),
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for queries
CREATE INDEX idx_feedback_forms_target ON feedback_forms(target_type, target_id);
CREATE INDEX idx_responses_form ON feedback_responses(form_id);
CREATE INDEX idx_responses_course ON feedback_responses(course_id);

```

Notes:
- `metadata` and `answer_meta` fields are JSONB to allow flexible storage for scales, options, or attachments.
- Use migrations (Flyway, Liquibase, or node migration tools) to manage schema changes.
