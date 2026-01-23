# LearnAI - Developer Quick Reference

## 🚀 Quick Start

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Run production
npm run start
```

## 📁 Project Structure

```
learnai/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Styles
│   └── api/chat/route.ts          # Chat API
│
├── components/
│   ├── study-planner.tsx
│   ├── notes-summarizer.tsx
│   ├── exam-prep-assistant.tsx
│   ├── doubt-chatbot.tsx
│   └── ui/                         # shadcn components
│
├── lib/
│   └── helpers.ts                  # Utilities
│
└── scripts/
    └── setup-db.sql               # Database
```

## 🎯 Key Files to Know

| File | Purpose | Lines |
|------|---------|-------|
| `app/page.tsx` | Main dashboard | 201 |
| `components/study-planner.tsx` | Study feature | 237 |
| `components/notes-summarizer.tsx` | Summarizer feature | 273 |
| `components/exam-prep-assistant.tsx` | Exam feature | 397 |
| `components/doubt-chatbot.tsx` | Chatbot feature | 246 |
| `lib/helpers.ts` | Utility functions | 80 |
| `app/api/chat/route.ts` | Chat API | 21 |

## 🔧 Common Tasks

### Add a New Study Feature
1. Create component in `/components`
2. Add TabsTrigger in `page.tsx`
3. Add TabsContent with your component
4. Create API route if needed in `/app/api`

### Modify Colors
Edit `/app/globals.css`:
```css
:root {
  --primary: oklch(0.52 0.22 254.8); /* Change this */
}
```

### Add API Endpoint
Create file: `/app/api/feature/route.ts`
```typescript
export async function POST(req: Request) {
  // Your code
}
```

### Update Database
1. Create migration in Supabase
2. Update types if needed
3. Add RLS policies

### Add New Language to Chatbot
Edit `components/doubt-chatbot.tsx`:
```typescript
const languages = [
  { code: 'new-lang', name: 'Language Name' },
]
```

## 📦 Dependencies

### Core
- `next`: 16.0.0
- `react`: 19.0.0
- `typescript`: Latest

### UI & Styling
- `tailwindcss`: v4
- `shadcn/ui`: Latest
- `lucide-react`: Latest
- `@radix-ui/*`: Latest

### AI & Database
- `ai`: v4.0.0 (Vercel AI SDK v5)
- `@ai-sdk/react`: Latest
- `@supabase/supabase-js`: Latest

## 🎨 Design Tokens

### Colors
```
Primary: Blue (oklch(0.52 0.22 254.8))
Secondary: Teal (oklch(0.72 0.18 160.2))
Accent: Orange (oklch(0.65 0.2 48.8))
Neutral: Grays and whites
```

### Spacing Scale
```
xs: 0.25rem
sm: 0.5rem
md: 1rem
lg: 1.5rem
xl: 2rem
2xl: 3rem
```

### Typography
```
Font-Sans: Geist
Font-Mono: Geist Mono
Line-Height: 1.5-1.6 (body)
```

## 🔌 API Endpoints

```
POST /api/chat
  body: { messages: [{role, content}] }

POST /api/generate-study-plan
  body: { subject, topic, deadline, studyLevel }

POST /api/summarize
  body: { content }
```

## 🗄️ Database Tables

```sql
study_sessions (id, user_id, subject, topic, ...)
notes_summaries (id, user_id, file_name, summary, ...)
exam_preparations (id, user_id, exam_name, ...)
chat_messages (id, user_id, role, content, ...)
user_preferences (user_id, theme, ...)
```

## 🔐 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 🧪 Testing

```bash
# Build test
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## 🚀 Deployment

```bash
# Vercel
vercel deploy --prod

# Check logs
vercel logs
```

## 📊 Performance Tips

1. Use `<Image>` for images
2. Implement ISR for static content
3. Enable gzip compression
4. Use streaming for APIs
5. Optimize database indexes
6. Monitor bundle size

## 🐛 Debug Tips

### Enable Debug Logging
```typescript
console.log('[v0] Debug info:', variable)
```

### Check API Response
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
})
console.log('[v0] Response:', await response.json())
```

### Inspect Component State
```tsx
useEffect(() => {
  console.log('[v0] State updated:', state)
}, [state])
```

## 📚 Component Pattern

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

export default function Feature() {
  const [state, setState] = useState('')

  return (
    <div className="space-y-4">
      <Card>
        {/* Your content */}
      </Card>
    </div>
  )
}
```

## 🎯 Naming Conventions

- **Components**: PascalCase (`StudyPlanner.tsx`)
- **Functions**: camelCase (`calculateProgress()`)
- **Constants**: UPPER_CASE (`MAX_DURATION`)
- **Types**: PascalCase (`StudySession`)
- **Files**: kebab-case for utilities (`study-helper.ts`)

## 🔍 Code Examples

### Fetch from API
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
})
const data = await response.json()
```

### Update State
```typescript
setItems([...items, newItem])
setItem(items.map(i => i.id === id ? updated : i))
setItem(items.filter(i => i.id !== id))
```

### Format Date
```typescript
new Date(deadline).toLocaleDateString()
```

### Call Helper Function
```typescript
import { daysUntilDeadline } from '@/lib/helpers'
const days = daysUntilDeadline(deadline)
```

## 📋 Code Style

- 2-space indentation
- Single quotes for strings
- Semicolons required
- Arrow functions preferred
- Trailing commas in objects
- Type annotations for functions

## ⚠️ Common Mistakes

1. ❌ Calling AI SDK from client component
   ✅ Call from server action or API route

2. ❌ Importing from read-only files
   ✅ Use Move(operation="copy") first

3. ❌ Direct localStorage in server
   ✅ Use server actions for persistence

4. ❌ No error handling in APIs
   ✅ Always wrap in try-catch

5. ❌ Forgetting RLS policies
   ✅ Enable RLS on all tables

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [AI SDK](https://sdk.vercel.ai)
- [Supabase Docs](https://supabase.com/docs)

## 📞 Quick Help

**Component not rendering?**
- Check import statements
- Verify 'use client' directive
- Check console for errors

**API not responding?**
- Check environment variables
- Verify API route file location
- Check request format
- Look at server logs

**Styling not applied?**
- Check Tailwind class names
- Verify globals.css loaded
- Check class conflicts
- Clear cache and rebuild

**Database issues?**
- Check RLS policies
- Verify user authentication
- Test query in Supabase
- Check database logs

## 📈 Scaling Checklist

- [ ] Add authentication
- [ ] Enable caching
- [ ] Optimize queries
- [ ] Add monitoring
- [ ] Setup backups
- [ ] Implement rate limiting
- [ ] Add analytics
- [ ] Performance testing

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
