# LearnAI AI Timetable & Audio Feature - Quick Reference

## Feature at a Glance

| Aspect | Details |
|--------|---------|
| **Feature Name** | AI-Powered Study Timetable Generator + Paper-Turning Audio |
| **Location** | Study Plan & Exam Prep tabs |
| **Trigger** | Auto-appears when you add study sessions/exams |
| **AI Model** | OpenAI GPT-4o-mini |
| **Audio Effect** | Subtle paper-turning sound on tab switches |
| **Status** | Production Ready ✓ |

## How to Use

### Study Planner Approach
```
1. Study Plan tab → Add Session → Fill (Subject, Topic, Deadline)
2. Add 2+ sessions
3. "AI Timetable" card appears ↓
4. Click "Generate Timetable"
5. See 14-30 day schedule
6. Download as CSV (optional)
```

### Exam Prep Approach
```
1. Exam Prep tab → New Exam → Fill (Name, Subject, Date, Topics)
2. Select exam from list
3. "AI Timetable" card appears ↓
4. Click "Generate Timetable"
5. Subject-specific schedule generated
6. Download and use
```

## Key Features

### AI Timetable
- ✓ Day-by-day breakdown
- ✓ Time slot recommendations (9 AM, 2 PM, 6 PM)
- ✓ Subject distribution
- ✓ Focus areas specified
- ✓ CSV export available
- ✓ Regenerate for alternatives

### Paper-Turning Audio
- ✓ Plays on tab switch
- ✓ Non-intrusive volume
- ✓ All devices supported
- ✓ Graceful fallback
- ✓ Accessibility-friendly
- ✓ No user setup needed

## API Endpoints

### Generate Timetable
```
POST /api/generate-study-timetable

Input:
  - subjects: string[]
  - examDate: YYYY-MM-DD
  - daysUntilExam: number

Output:
  - timetable: TimetableEntry[]
```

## File Structure

```
LearnAI/
├── components/
│   └── ai-timetable-generator.tsx
├── hooks/
│   └── use-audio.ts
├── app/
│   ├── page.tsx (modified)
│   └── api/generate-study-timetable/route.ts
├── public/sounds/
│   └── paper-turn.wav
├── AI_TIMETABLE_FEATURE.md (full docs)
├── AUDIO_IMPLEMENTATION.md (technical)
└── AI_TIMETABLE_AUDIO_SUMMARY.md (overview)
```

## Component Props

### AITimetableGenerator
```typescript
<AITimetableGenerator
  subjects={["Math", "Physics"]}
  examDate="2025-03-15"
  onGenerationComplete={(timetable) => {}}
/>
```

### useAudio
```typescript
const { play, stop } = useAudio('/sounds/paper-turn.wav')
play()  // Play sound
stop()  // Stop sound
```

## Styling Classes

```css
/* Color scheme (paper aesthetic) */
--primary           /* Rich brown */
--secondary         /* Soft sage */
--accent            /* Warm cream */
--muted             /* Light grays */

/* Component styling */
.border-primary/20  /* Light borders */
.bg-accent/10       /* Subtle backgrounds */
.text-primary       /* Brown text */
```

## Common Tasks

### Generate Custom Schedule
```typescript
const handleGenerate = async () => {
  const response = await fetch('/api/generate-study-timetable', {
    method: 'POST',
    body: JSON.stringify({
      subjects: ['Math', 'Physics'],
      examDate: '2025-03-15',
      daysUntilExam: 30,
    }),
  })
  const { timetable } = await response.json()
}
```

### Play Sound on Event
```typescript
const { play } = useAudio('/sounds/paper-turn.wav')

const handleTabSwitch = () => {
  play()
  setActiveTab(newTab)
}
```

### Download Timetable as CSV
```typescript
const downloadTimetable = (timetable) => {
  const csv = timetable.flatMap(day =>
    day.sessions.map(s => 
      `${day.day},${s.subject},${s.duration}h,${s.focus}`
    )
  ).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'timetable.csv'
  a.click()
}
```

## Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✓ | ✓ | Full support |
| Firefox | ✓ | ✓ | Full support |
| Safari | ✓ | ✓ | iOS 10+ |
| Edge | ✓ | ✓ | Full support |
| IE 11 | ✗ | - | Not supported |

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| No timetable button | Add study session/exam with future date |
| Sound not playing | Check volume, browser mute, speaker |
| Schedule looks wrong | Verify exam date, try regenerating |
| Can't download CSV | Check browser download permissions |
| Audio overlaps | Rapid clicks handled, expected behavior |

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response | < 3 seconds |
| Audio Load | < 100ms (cached) |
| Play Latency | < 50ms |
| Memory Usage | < 5MB total |
| CSV Download | Instant |

## Accessibility Checklist

- [x] Keyboard navigation
- [x] Screen reader support
- [x] Color contrast (7:1+)
- [x] Audio graceful fallback
- [x] ARIA labels
- [x] Focus indicators
- [x] Mobile responsive

## Documentation Map

| Document | Content |
|----------|---------|
| AI_TIMETABLE_FEATURE.md | Complete feature guide |
| AUDIO_IMPLEMENTATION.md | Audio technical details |
| AI_TIMETABLE_AUDIO_SUMMARY.md | Feature overview |
| QUICK_REFERENCE.md | This file (quick lookup) |

## Code Examples

### Basic Implementation
```typescript
'use client'

import { useAudio } from '@/hooks/use-audio'
import AITimetableGenerator from '@/components/ai-timetable-generator'

export default function MyPage() {
  const { play } = useAudio('/sounds/paper-turn.wav')
  
  const handleClick = () => play()
  
  return (
    <>
      <button onClick={handleClick}>Generate</button>
      <AITimetableGenerator 
        subjects={['Math']} 
        examDate="2025-03-15" 
      />
    </>
  )
}
```

### Advanced Implementation
```typescript
const [timetable, setTimetable] = useState(null)
const [loading, setLoading] = useState(false)

const generateSchedule = async (subjects, date) => {
  setLoading(true)
  try {
    const res = await fetch('/api/generate-study-timetable', {
      method: 'POST',
      body: JSON.stringify({
        subjects,
        examDate: date,
        daysUntilExam: getDaysUntil(date),
      }),
    })
    const data = await res.json()
    setTimetable(data.timetable)
  } catch (err) {
    console.error('Generation failed:', err)
  } finally {
    setLoading(false)
  }
}
```

## Tips & Best Practices

### For Students
1. Add all subjects before generating
2. Set realistic exam dates (2+ weeks out)
3. Use generated schedule as baseline
4. Adjust based on difficulty
5. Download for offline reference
6. Regenerate for different approaches

### For Developers
1. Customize AI prompt in API route
2. Add sound volume control in future
3. Extend with additional audio effects
4. Store timetables in Supabase (v2)
5. Add analytics tracking
6. Create export templates

### For Customization
1. Change colors in `globals.css`
2. Modify audio in `use-audio.ts`
3. Update AI logic in API route
4. Add new components following pattern
5. Test thoroughly on mobile
6. Verify accessibility compliance

## Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Production | Initial release |
| Future | TBD | Planned | Audio toggle, storage, analytics |

## Support Contacts

- **Documentation:** See full guides in markdown files
- **Bugs:** Check browser console for errors
- **Feature Requests:** Documented in guides
- **Troubleshooting:** See QUICK_REFERENCE sections

## Quick Links

- **Full Feature Guide:** `AI_TIMETABLE_FEATURE.md`
- **Audio Setup:** `AUDIO_IMPLEMENTATION.md`
- **Feature Overview:** `AI_TIMETABLE_AUDIO_SUMMARY.md`
- **Component Code:** `/components/ai-timetable-generator.tsx`
- **API Code:** `/app/api/generate-study-timetable/route.ts`
- **Audio Hook:** `/hooks/use-audio.ts`

---

**Quick Reference v1.0** | January 2025 | Production Ready ✓
