# AI-Powered Study Timetable Generator Feature

## Overview

The AI-Powered Study Timetable Generator is an intelligent feature that creates personalized study schedules tailored to each student's subjects and exam dates. Combined with paper-turning sound effects, it enhances the immersive, scholarly experience of the LearnAI platform.

## Features

### 1. **AI Study Timetable Generator**

#### How It Works
- **Input**: Students provide their subjects/topics and exam date
- **Processing**: AI algorithm distributes study time across subjects based on:
  - Number of days until exam
  - Number of subjects to study
  - Recommended study hours per day
  - Progressive intensity (builds toward exam date)
- **Output**: Day-by-day study schedule with:
  - Specific time slots (morning, afternoon, evening)
  - Subject assignments for each slot
  - Focus areas (what to study in that session)
  - Recommended duration per session

#### Access Points
1. **Study Planner Tab**: Appears automatically after adding study sessions
2. **Exam Prep Tab**: Available for each exam with syllabus/subjects defined
3. **Automatic Triggers**: Generated when you have:
   - 2+ study sessions with same deadline (Study Planner)
   - Active exam with defined subjects (Exam Prep)

#### Component: `AITimetableGenerator`
Located in `/components/ai-timetable-generator.tsx`

```typescript
interface AITimetableProps {
  subjects: string[]      // List of subjects to study
  examDate: string        // Target exam date (YYYY-MM-DD)
  onGenerationComplete?: (timetable: TimetableEntry[]) => void
}
```

### 2. **Paper-Turning Sound Effects**

#### Audio Implementation
- **Hook**: `useAudio` in `/hooks/use-audio.ts`
- **Sound File**: `/public/sounds/paper-turn.wav`
- **Trigger**: Tab switches on main dashboard

#### Features
- Non-blocking playback (fails silently for accessibility)
- Automatic reset for quick successive plays
- Respects browser autoplay policies
- Mobile-friendly with fallback handling

#### Usage in Components
```typescript
const { play: playPageTurn } = useAudio('/sounds/paper-turn.wav')

const handleTabChange = (value: string) => {
  playPageTurn()
  setActiveTab(value)
}
```

### 3. **Enhanced Exam Preparation**

The AI timetable integrates seamlessly with exam preparation:
- Creates subject-specific schedules
- Accounts for exam date in calculations
- Generates focus areas based on topics in syllabus
- Downloadable as CSV for external use

## API Endpoints

### `POST /api/generate-study-timetable`

Generates a personalized study timetable based on subjects and exam date.

**Request Body:**
```json
{
  "subjects": ["Mathematics", "Physics"],
  "examDate": "2025-03-15",
  "daysUntilExam": 30
}
```

**Response:**
```json
{
  "timetable": [
    {
      "day": 1,
      "date": "2025-02-13",
      "sessions": [
        {
          "subject": "Mathematics",
          "duration": 2.5,
          "focus": "Review fundamentals and practice",
          "timeSlot": "9:00 AM - 11:30 AM"
        }
      ],
      "totalHours": 5
    }
  ]
}
```

**Error Handling:**
- Returns 400 if required fields missing
- Returns 400 if exam date is in the past
- Returns 500 if AI generation fails (with fallback timetable)

## User Experience

### Step-by-Step Usage

#### Study Planner Flow
1. Click "Study Plan" tab
2. Click "Add Session" to create study plans
3. Fill in: Subject, Topic, Deadline, Priority
4. Create multiple sessions
5. AI Timetable Generator automatically appears
6. Click "Generate Timetable" button
7. Review generated schedule
8. Optional: Download as CSV

#### Exam Prep Flow
1. Click "Exam Prep" tab
2. Click "New Exam" to create exam entry
3. Fill in: Exam Name, Subject, Date, Syllabus (comma-separated topics)
4. Select exam from list
5. AI Timetable Generator appears
6. Click "Generate Timetable" button
7. Review schedule with topic-specific focus areas

#### Paper-Turning Audio
- Plays automatically when switching tabs
- Silent on devices without audio support
- Doesn't interrupt user interaction
- Optional feature (accessibility-friendly)

## Design Integration

### Consistent with Paper Aesthetic
- Timetable displayed in refined card-based layout
- Uses primary/muted color palette from design system
- Decorative line elements match scholarship theme
- Responsive grid layout for all device sizes
- Italic descriptive text maintains scholarly tone

### Mobile Responsiveness
- Full-width cards on mobile
- Scrollable timetable on smaller screens
- Touch-friendly buttons and inputs
- Collapsible exam list on narrow viewports
- Maintains readability at all breakpoints

### Accessibility Features
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Audio fails gracefully (no broken UX)
- Color contrast meets WCAG AA standards
- Focus indicators on interactive elements

## Technical Details

### State Management
- React hooks for local state
- Exam data persists during session
- Timetable regeneration supported (replace previous)
- Download functionality works offline

### Performance Optimization
- Lazy-loaded audio files
- Memoized components where applicable
- Efficient re-renders with proper dependencies
- Minimal animation for smooth 60fps

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Mobile browsers with audio support
- Progressive enhancement approach

## Customization

### Extending the Timetable Generator

To customize timetable generation logic:

1. **Modify AI prompt** in `/app/api/generate-study-timetable/route.ts`:
   - Change system message for different strategies
   - Adjust temperature (0.7) for consistency/creativity
   - Modify maxOutputTokens for longer responses

2. **Change display format** in `/components/ai-timetable-generator.tsx`:
   - Update TimetableEntry interface
   - Modify card layout and styling
   - Add new information fields

3. **Customize audio** in `/hooks/use-audio.ts`:
   - Add volume control
   - Implement audio preferences
   - Add multiple sound options

## Testing Checklist

- [ ] Timetable generates with 2+ subjects
- [ ] Displays correct dates
- [ ] Time slots vary appropriately (morning/afternoon/evening)
- [ ] CSV download works
- [ ] Paper-turning sound plays on tab click
- [ ] Sound fails gracefully on unsupported devices
- [ ] Mobile layout displays correctly
- [ ] Keyboard navigation works
- [ ] Screen reader announces all content
- [ ] Works offline after initial load

## Known Limitations

1. **Offline Usage**: AI generation requires API connection (fallback provided)
2. **Audio**: Not supported on all devices/browsers (graceful fallback)
3. **Timetable Storage**: Not persisted to database (session-based)
4. **Custom Schedules**: Cannot manually edit AI-generated timetables
5. **Recurring Exams**: Single schedule per exam (no multi-exam coordination)

## Future Enhancements

Potential improvements for future versions:

1. **Smart Adjustments**
   - User feedback on timetable difficulty
   - Auto-adjustment based on completed sessions
   - Learning style preferences

2. **Enhanced Audio**
   - Multiple paper-turning variations
   - Sound toggle in preferences
   - Audio settings (volume, frequency)

3. **Persistent Storage**
   - Save timetables to Supabase
   - Compare multiple generations
   - Historical tracking

4. **Advanced Analytics**
   - Actual vs. planned study time
   - Subject mastery predictions
   - Recommendation engine

5. **Collaboration**
   - Share timetables with study groups
   - Synchronized study sessions
   - Peer comparison and motivation

## Files Modified/Created

### New Files
- `/components/ai-timetable-generator.tsx` - Main timetable component
- `/hooks/use-audio.ts` - Audio management hook
- `/app/api/generate-study-timetable/route.ts` - AI generation API
- `/public/sounds/paper-turn.wav` - Audio effect

### Modified Files
- `/app/page.tsx` - Added audio hook and tab handler
- `/components/study-planner.tsx` - Integrated AI timetable generator
- `/components/exam-prep-assistant.tsx` - Integrated AI timetable generator

## Support & Troubleshooting

### Common Issues

**Timetable not appearing:**
- Ensure you have at least 1 subject/exam defined
- Check that exam date is in the future
- Verify API endpoint is accessible

**No sound playing:**
- Check browser permissions for audio
- Verify speakers/audio output working
- Audio files may not be supported on device
- Check browser console for errors

**Incorrect schedule:**
- AI model may interpret instructions differently
- Try regenerating for alternative schedule
- Verify subjects are clearly named
- Check exam date is correctly formatted

### Debug Logging

Enable debug mode in components:
```typescript
console.log('[v0] Timetable generation started:', { subjects, examDate })
```

## Contact & Feedback

For issues or feature requests related to the AI Timetable feature:
1. Check browser console for error messages
2. Verify all required fields are filled
3. Test in different browser if issue persists
4. Report with reproduction steps and browser info

---

**Feature Status**: Production Ready (v1.0)
**Last Updated**: January 2025
**Maintenance**: Active
