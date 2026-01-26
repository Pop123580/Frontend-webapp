# Dark Mode Implementation Guide - LearnAI

## Overview

This guide documents the comprehensive dark mode implementation for LearnAI, designed with eye comfort and visual consistency as primary objectives.

## Dark Mode Features

### 1. Eye Strain Reduction

**Color Adjustments**
- Background lightness: 16% (optimal for low-light environments)
- Foreground lightness: 88% (reduces contrast for comfortable reading)
- Reduced saturation across all colors (softer, more relaxing)
- Warm color palette maintained (browns, creams, sage greens)

**Technical Implementation**
```css
.dark {
  --background: oklch(0.16 0.03 70);      /* Dark warm brown */
  --foreground: oklch(0.88 0.008 70);     /* Soft cream text */
  --primary: oklch(0.6 0.12 70);          /* Warm brown accent */
  --muted-foreground: oklch(0.68 0.008 70); /* Soft gray text */
}
```

### 2. Accessibility Standards

- **WCAG AA Compliance**: All text-to-background contrast ratios ≥ 4.5:1
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Color Scheme**: Respects `prefers-color-scheme` system setting
- **Screen Readers**: Semantic HTML with proper ARIA labels

### 3. Paper-Like Aesthetic Maintained

**Dark Mode Visual Elements**
- Warm brown backgrounds (not pure black/gray)
- Cream text (not pure white)
- Subtle texture overlays
- Soft shadows for reduced contrast
- Consistent typography with adjusted sizes

## Implementation Details

### Color Palette (Dark Mode)

| Component | OKLCH Value | Use Case |
|-----------|------------|----------|
| Background | `oklch(0.16 0.03 70)` | Main background |
| Card | `oklch(0.2 0.04 70)` | Card backgrounds |
| Foreground | `oklch(0.88 0.008 70)` | Primary text |
| Primary | `oklch(0.6 0.12 70)` | Buttons, accents |
| Secondary | `oklch(0.52 0.07 155)` | Alternative color |
| Muted | `oklch(0.3 0.04 70)` | Disabled states |
| Accent | `oklch(0.7 0.08 80)` | Highlights |

### Eye Comfort Features

**1. Reduced Brightness Contrast**
```css
@media (prefers-color-scheme: dark) {
  /* Softer shadows for less harsh transitions */
  [class*="card"] {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}
```

**2. Warm Color Temperature**
- Primary hue: 70° (warm brown)
- Secondary hue: 155° (sage green)
- Accent hue: 80° (warm cream)
- All colors reduced saturation for softness

**3. Typography Adjustments**
- Reduced text opacity in dark mode
- Softer placeholder text
- Improved line spacing
- Letter spacing optimized for dark backgrounds

### Feature: AI Button Enhancement

**Dark Mode Styling**
```tsx
<Button
  className="gap-2 flex-1 sm:flex-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
  size="lg"
>
  <Sparkles className="w-4 h-4" />
  AI
</Button>
```

**Visual Feedback**
- Animated sparkle icon (pulsing effect)
- Hover state with reduced opacity
- Loading state with spinning animation
- Disabled state with reduced opacity

### Timetable Display in Dark Mode

**Card Styling**
- Background: `bg-muted/25` (subtle background)
- Hover effect: `hover:bg-muted/35` (smooth transition)
- Border: `border-border/40` (subtle separation)

**Session Item**
- Background: `bg-background/40` (minimal contrast)
- Icon color: Primary color (visual consistency)
- Duration badge: `bg-primary/20` (subtle highlight)
- Time display: Reduced opacity for secondary info

## Audio Integration

### Paper-Turning Sound

**Features**
- 800-1200ms duration
- Subtle, professional rustling sound
- Plays on tab switches
- Graceful fallback on unsupported browsers
- Respects browser mute settings

**Implementation**
```typescript
const { play: playPageTurn } = useAudio('/sounds/paper-turn.wav')

const handleTabChange = (value: string) => {
  playPageTurn()
  setActiveTab(value)
}
```

## Responsive Design

### Mobile (< 640px)
- Single-column layout
- Full-width buttons
- Stacked forms
- Optimized touch targets (48px minimum)

### Tablet (640px - 1024px)
- Two-column grid
- Side-by-side inputs
- Flexible button arrangement

### Desktop (> 1024px)
- Three-column layout
- Multi-column grids
- Full feature visibility

## Testing Checklist

### Dark Mode Tests
- [x] Colors render correctly in dark mode
- [x] Text is readable (WCAG AA)
- [x] All buttons visible and functional
- [x] Forms input clearly
- [x] Cards/containers properly styled
- [x] Hover states visible
- [x] Focus indicators visible
- [x] Icons display correctly

### Eye Comfort Tests
- [x] No pure white backgrounds
- [x] No pure black text
- [x] Soft shadows (not harsh)
- [x] Warm color palette
- [x] Reduced saturation
- [x] Good contrast ratios

### Accessibility Tests
- [x] Keyboard navigation works
- [x] Screen reader friendly
- [x] Focus visible on all interactive elements
- [x] Color-independent information
- [x] Respects system preferences

### Audio Tests
- [x] Paper-turn sound plays on tab switch
- [x] Sound doesn't block UI interaction
- [x] Works across browsers
- [x] Respects mute state
- [x] No console errors

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✓ | Full support |
| Firefox | ✓ | Full support |
| Safari | ✓ | Full support |
| Mobile Safari | ✓ | Full support |
| Android Chrome | ✓ | Full support |
| Samsung Internet | ✓ | Full support |

## Performance Impact

- **Color Palette**: No performance impact (CSS variables)
- **Audio**: Lazy-loaded on first interaction
- **Animations**: Respects `prefers-reduced-motion`
- **Bundle Size**: Minimal increase (~1KB)

## Future Enhancements

1. **Custom Theme Colors**: Allow users to customize colors
2. **Schedule Audio**: Different sounds for different interactions
3. **Audio Preferences**: Toggle audio on/off
4. **Accessibility Settings**: Further customization options
5. **Theme Sync**: Save user preference across sessions

## Troubleshooting

### Audio Not Playing
- Check browser mute state
- Verify sound file exists: `/public/sounds/paper-turn.wav`
- Check browser console for errors
- Ensure autoplay policies allow audio

### Dark Mode Not Activating
- Check system dark mode preference
- Clear browser cache
- Verify CSS custom properties loaded
- Check browser DevTools for CSS values

### Text Not Visible
- Verify contrast ratio (should be ≥ 4.5:1)
- Check background color value
- Review typography settings
- Test with accessibility tools

## Related Files

- `/app/globals.css` - Dark mode CSS variables and styles
- `/components/ai-timetable-generator.tsx` - AI button implementation
- `/hooks/use-audio.ts` - Audio hook for sound effects
- `/public/sounds/paper-turn.wav` - Audio file

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Complete and Production-Ready
