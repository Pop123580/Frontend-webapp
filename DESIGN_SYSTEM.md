# LearnAI Design System - Paper-Like Aesthetic

## Overview

LearnAI features a sophisticated, paper-like aesthetic that prioritizes traditional scholarship, authenticity, and craftsmanship. The design emphasizes natural materials, warm neutrals, and scholarly refinement rather than modern minimalism.

## Color Palette

### Light Mode
- **Background**: Warm off-white (oklch 0.97 0.01 70) - Natural paper tone
- **Foreground**: Rich brown (oklch 0.25 0.04 65) - Traditional scholarly color
- **Primary**: Deep brown (oklch 0.45 0.12 65) - Authoritative and professional
- **Secondary**: Soft sage (oklch 0.65 0.08 155) - Calming and natural
- **Accent**: Warm cream (oklch 0.85 0.08 80) - Subtle highlights
- **Border**: Soft brown-gray (oklch 0.92 0.008 70) - Gentle separation

### Dark Mode
- **Background**: Warm dark brown (oklch 0.18 0.04 70) - Natural parchment
- **Foreground**: Warm cream (oklch 0.92 0.01 70) - Easy on the eyes
- **Primary**: Light brown (oklch 0.65 0.14 70) - Warm and inviting
- **Secondary**: Lighter sage (oklch 0.55 0.08 155) - Maintains harmony
- **Accent**: Lighter cream (oklch 0.75 0.1 80) - Accessible highlights
- **Border**: Warm gray-brown (oklch 0.28 0.04 70) - Subtle definition

## Typography

### Font Family
- **Sans-serif**: Geist (provides clean, readable text)
- **Mono**: Geist Mono (for code and technical content)

### Heading Style
- Font-weight: 500 (medium, not bold)
- Letter-spacing: 0.3px (subtle expansion)
- Includes decorative line element below major headings
- Title: 2xl (32px), Subtitle: base (16px)

### Body Text
- Line-height: 1.6 (relaxed reading)
- Italic taglines for descriptive text
- Feature medium font weight for UI labels

## Visual Elements

### Decorative Lines
All major section headings are accompanied by a 0.5px decorative line beneath them:
```html
<div className="h-0.5 w-12 bg-primary/40"></div>
```
Creates a scholarly, elegant separation.

### Card Styling
- Subtle shadows: `0 1px 3px rgba(0, 0, 0, 0.08)`
- Hover shadow: `0 4px 8px rgba(0, 0, 0, 0.12)`
- Border: Very subtle, `border-border/40`
- Background: Slight transparency with paper texture

### Buttons
- Primary: Rich brown background with cream text
- Secondary: Outlined with primary color
- Hover: Smooth transition with slight shadow increase
- Size: Medium (8-10px padding)

### Input Fields
- Border: Soft, warm-gray
- Background: Slightly off-white with texture
- Focus: Primary color ring
- Placeholder: Muted foreground color

## Paper Texture

Subtle texture applied to:
1. Background body with horizontal line pattern
2. Cards with diagonal cross-hatch (minimal opacity)
3. Creates authentic, handcrafted feeling

## Component-Specific Styling

### Headers
- Logo: Square icon (9x9px) with primary background
- Title: Medium font weight with subtitle
- Tagline: Italic, muted color
- Backdrop blur for sticky positioning

### Dashboard Overview
- Welcome heading with decorative line
- Stat cards: Light background, font-light numbers
- Feature boxes: Muted background with subtle borders
- 4-column grid responsive to mobile

### Sections (Planner, Summarizer, etc.)
- Main heading: 2xl font-medium
- Decorative line underneath
- Italic descriptive text
- Add/New buttons on the right

### Quick Tips Card
- Primary-tinted background (accent/20)
- Primary color icon
- Maintains scholarly but approachable tone

### Footer
- Minimal design with decorative line
- Centered, italic tagline
- Backdrop blur effect
- Very light borders

## Spacing & Layout

- **Gap/Padding**: 4px (Tailwind `gap-4`, `p-4`)
- **Section Gap**: 6-8px (for breathing room)
- **Border Radius**: 0.375rem (subtle, not rounded)
- **Backdrop Blur**: Applied to sticky elements

## Responsive Design

- **Mobile**: Single column layouts, full-width cards
- **Tablet (768px)**: 2-column grids
- **Desktop (1024px)**: 3-4 column grids
- **Large (1280px)**: Full multi-column layouts

## Accessibility

- Color contrast ratio: 7:1+ for all text
- Focus states: Clear primary color ring
- Icon sizes: 4-5px (consistent)
- ARIA labels: Applied to all interactive elements
- Screen reader friendly semantic HTML

## Implementation Notes

1. **Never use bright, modern colors** - stick to warm earth tones
2. **Avoid gradients** - use solid colors only
3. **Decorative lines** are key to the scholarly aesthetic
4. **Typography** should feel traditional, not trendy
5. **Spacing** is generous to create breathing room
6. **Shadows** are subtle, not dramatic
7. **Hover states** are smooth transitions, not sudden changes

## Future Enhancements

- Add watercolor-style accents (optional)
- Implement serif font for headings (future iteration)
- Add paper grain texture to hero sections
- Custom handwritten-style elements for special features
