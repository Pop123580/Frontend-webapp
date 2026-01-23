# LearnAI Integration Guide

This guide explains how to integrate and configure all AI-powered features in LearnAI.

## Table of Contents
1. [AI Service Configuration](#ai-service-configuration)
2. [Database Setup](#database-setup)
3. [API Routes](#api-routes)
4. [Environment Variables](#environment-variables)
5. [Feature Integration](#feature-integration)

## AI Service Configuration

### Vercel AI SDK v5 Setup

The application uses AI SDK v5 with the Vercel AI Gateway for LLM inference.

**Key Features:**
- No explicit API key needed for OpenAI (uses Vercel AI Gateway)
- Streaming responses for better UX
- Server-side functions only (not called from client components)
- Type-safe message handling

**Supported Models:**
- `openai/gpt-4o-mini` - Default model for all features
- `openai/gpt-4o` - Higher performance (optional)
- Other providers available through Vercel AI Gateway

### Configuration Steps

1. **Verify Vercel AI Gateway Access**
   - Ensure your Vercel project has AI Gateway enabled
   - Check environment variables in Vercel dashboard

2. **No API Key Needed**
   - AI SDK v5 uses Vercel AI Gateway by default
   - Gateway handles authentication and routing
   - Your Vercel project context is used for access control

## Database Setup

### Supabase Integration

The application uses Supabase PostgreSQL with Row Level Security (RLS).

**Database Tables:**

```sql
-- Users table (handled by Supabase Auth)
-- Extend with user profiles as needed

-- Study Sessions
CREATE TABLE study_sessions (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration INT NOT NULL,
  deadline DATE NOT NULL,
  priority TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes Summaries
CREATE TABLE notes_summaries (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  original_text TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exam Preparations
CREATE TABLE exam_preparations (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_date DATE NOT NULL,
  syllabus TEXT NOT NULL,
  topics_progress JSONB NOT NULL,
  resources TEXT[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'english',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  theme TEXT DEFAULT 'auto',
  default_session_duration INT DEFAULT 60,
  study_reminders BOOLEAN DEFAULT TRUE,
  default_language TEXT DEFAULT 'english',
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Enable RLS:**
```sql
-- Example for study_sessions
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own study sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create study sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study sessions"
  ON study_sessions FOR DELETE
  USING (auth.uid() = user_id);
```

## API Routes

### 1. Chat API
**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is photosynthesis?"
    }
  ]
}
```

**Response:**
```
Streaming text response with the AI's answer
```

**Features:**
- Multi-language support
- Context-aware educational responses
- Streaming for real-time feedback

**Configuration:**
```typescript
// models/chat can be changed in app/api/chat/route.ts
model: 'openai/gpt-4o-mini'
```

### 2. Study Plan Generator
**Endpoint:** `POST /api/generate-study-plan`

**Request:**
```json
{
  "subject": "Mathematics",
  "topic": "Calculus - Integration",
  "deadline": "2024-03-15",
  "studyLevel": "intermediate"
}
```

**Response:**
```json
{
  "schedule": [
    {"day": 1, "hours": 2, "focus": "Overview and foundation"},
    {"day": 2, "hours": 2.5, "focus": "Core concepts"}
  ],
  "subtopics": ["Basic concepts", "Applications"],
  "resources": ["Textbooks", "Online tutorials"],
  "practiceStrategies": ["Active recall", "Spaced repetition"],
  "reviewSchedule": ["Daily review", "Weekly comprehensive review"]
}
```

### 3. Summarization API
**Endpoint:** `POST /api/summarize`

**Request:**
```json
{
  "content": "Long text or document content to summarize..."
}
```

**Response:**
```json
{
  "summary": "Concise 2-3 sentence summary",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"]
}
```

## Environment Variables

### Required Variables

```env
# Vercel AI Gateway (no explicit key needed for default gateway)
# If using custom provider, add:
# OPENAI_API_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Setting Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Feature Integration

### Study Planner Integration

**Components:**
- `/components/study-planner.tsx` - Main UI
- `/lib/helpers.ts` - Utility functions

**Data Flow:**
1. User creates study session
2. Data stored in `study_sessions` table
3. AI provides recommendations via `/api/generate-study-plan`
4. User views and manages sessions

**Key Functions:**
- `daysUntilDeadline()` - Calculate deadline urgency
- `generateSessionRecommendations()` - Create study schedule
- `getUrgencyLevel()` - Determine priority

### Notes Summarizer Integration

**Components:**
- `/components/notes-summarizer.tsx` - Main UI
- Files uploaded to Supabase Storage (optional)

**Data Flow:**
1. User uploads or pastes content
2. Content sent to `/api/summarize`
3. AI generates summary and key points
4. Results stored in `notes_summaries` table
5. User can copy or export summaries

**Features:**
- Text paste support
- PDF upload support
- Copy-to-clipboard
- Summary export

### Exam Prep Assistant Integration

**Components:**
- `/components/exam-prep-assistant.tsx` - Main UI
- `/components/progress-tracker.tsx` - Progress visualization

**Data Flow:**
1. User creates exam plan with topics
2. Exam stored in `exam_preparations` table
3. User tracks progress for each topic
4. Resources and notes stored with exam
5. Progress visualized in real-time

**Features:**
- Multi-topic tracking
- Resource management
- Integrated notes
- Progress visualization

### Doubt Chatbot Integration

**Components:**
- `/components/doubt-chatbot.tsx` - Chat UI
- `/app/api/chat/route.ts` - AI backend

**Data Flow:**
1. User selects language and asks question
2. Message sent to `/api/chat`
3. AI returns streaming response
4. Messages stored in `chat_messages` table
5. User can copy answers or ask follow-ups

**Features:**
- 7 language options
- Streaming responses
- Message history
- Copy functionality
- Example questions

## Advanced Configuration

### Custom AI Models

To use a different model, update the route files:

```typescript
// app/api/chat/route.ts
const result = await streamText({
  model: 'openai/gpt-4o', // Change model here
  // ... rest of config
})
```

### Custom Database Schema

To extend the database:

1. Create migration in Supabase Dashboard
2. Update types in TypeScript files
3. Update RLS policies
4. Update API routes if needed

### Streaming Optimization

For better streaming performance:

```typescript
// In API routes
return result.toTextStreamResponse()
// vs
return Response.json(result.text)
```

## Troubleshooting

### Common Issues

**AI not responding:**
- Check Vercel AI Gateway access
- Verify model availability
- Check server logs

**Data not saving:**
- Confirm Supabase connection
- Verify RLS policies
- Check user authentication

**API timeouts:**
- Increase timeout limits
- Check content size
- Verify network connection

## Security Best Practices

1. **Authentication:**
   - Use Supabase Auth for user management
   - Implement session management
   - Secure password hashing

2. **Data Protection:**
   - Enable RLS on all tables
   - Validate user input
   - Sanitize content before storage

3. **API Security:**
   - Validate requests on server
   - Implement rate limiting
   - Use HTTPS only

4. **Privacy:**
   - Comply with GDPR
   - Clear data retention policies
   - User consent management

## Performance Optimization

1. **Database:**
   - Add indexes for frequently queried columns
   - Use connection pooling
   - Optimize queries

2. **API:**
   - Implement caching
   - Use streaming for large responses
   - Optimize payload sizes

3. **Frontend:**
   - Use code splitting
   - Implement lazy loading
   - Optimize images

## Monitoring & Analytics

Track feature usage:
- Study sessions created
- Documents summarized
- Exams tracked
- Questions asked

Store metrics in database for analysis and improvement.

---

For more information, see [README.md](./README.md)
