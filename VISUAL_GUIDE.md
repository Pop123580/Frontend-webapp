# LearnAI Visual Reference Guide

## Paper-Like Aesthetic - Complete Visual Breakdown

---

## 1. COLOR SYSTEM

### Light Mode - The Paper Palette

```
┌─ BACKGROUND (Warm Off-White) ─┐
│ oklch(0.97 0.01 70)            │
│ A soft, natural paper-like      │
│ canvas that feels inviting      │
└────────────────────────────────┘

┌─ FOREGROUND (Rich Brown) ──────┐
│ oklch(0.25 0.04 65)            │
│ Deep, scholarly brown for text  │
│ Readable and traditional        │
└────────────────────────────────┘

┌─ PRIMARY (Deep Brown) ─────────┐
│ oklch(0.45 0.12 65)            │
│ Main action color              │
│ Buttons, links, icons          │
└────────────────────────────────┘

┌─ SECONDARY (Soft Sage) ────────┐
│ oklch(0.65 0.08 155)           │
│ Secondary accents              │
│ Complements primary warmth     │
└────────────────────────────────┘

┌─ ACCENT (Warm Cream) ──────────┐
│ oklch(0.85 0.08 80)            │
│ Subtle highlights              │
│ Backgrounds for emphasis       │
└────────────────────────────────┘

┌─ BORDER (Soft Brown-Gray) ─────┐
│ oklch(0.92 0.008 70)           │
│ Very subtle divisions          │
│ Gentle, not harsh              │
└────────────────────────────────┘
```

### Dark Mode - Warm Parchment

```
┌─ BACKGROUND (Warm Dark Brown) ─┐
│ oklch(0.18 0.04 70)            │
│ Like aged parchment            │
│ Comfortable for long reading   │
└────────────────────────────────┘

┌─ FOREGROUND (Warm Cream) ──────┐
│ oklch(0.92 0.01 70)            │
│ Easy on the eyes               │
│ High contrast without harshness│
└────────────────────────────────┘

┌─ PRIMARY (Light Brown) ────────┐
│ oklch(0.65 0.14 70)            │
│ Warm, inviting action color    │
│ Still maintains scholarly feel │
└────────────────────────────────┘
```

---

## 2. TYPOGRAPHY SYSTEM

### Heading Hierarchy

```
✓ H1 - 24px (text-2xl)
  Font-weight: Medium (500)
  Letter-spacing: 0.3px
  Color: Foreground
  + Decorative line below
  + Italic subtitle

✓ H2 - 20px (text-xl) 
  Font-weight: Medium (500)
  Used for section titles
  + Decorative line
  
✓ Labels - 12px (text-xs)
  Font-weight: Medium
  Uppercase with letter-spacing
  Color: Primary for emphasis
  
✓ Body - 14-16px
  Font-weight: Regular (400)
  Line-height: 1.6 (relaxed)
  Color: Foreground
  
✓ Taglines - 14px (text-sm)
  Font-weight: Regular
  Italic for descriptive text
  Color: Muted-foreground
```

### Typography Examples

```tsx
// Main Section Title
<h2 className="text-2xl font-medium text-foreground">Study Planner & Timetable</h2>
<div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>
<p className="text-muted-foreground text-sm italic">
  AI-powered scheduling that adapts to your learning pace
</p>

// Card Label
<CardTitle className="text-xs font-medium uppercase tracking-widest text-primary">
  Study Sessions
</CardTitle>

// Number Display
<p className="text-3xl font-light text-foreground">42</p>
```

---

## 3. DECORATIVE ELEMENTS

### Signature Decorative Line

The decorative line is KEY to the paper aesthetic:

```tsx
// Below every major heading
<div className="h-0.5 w-12 bg-primary/40 mt-2 mb-3"></div>

// Properties:
- Height: 0.5px (barely visible, elegant)
- Width: 48px (w-12)
- Color: Primary at 40% opacity
- Margin: 8px top, 12px bottom
- Creates scholarly, traditional feel
```

### Visual Impact

```
Study Planner & Timetable
━━━━━━━━━━━━━        ← This line creates the refined look
AI-powered scheduling that adapts to your learning pace
```

---

## 4. COMPONENT PATTERNS

### Header Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  📖  LearnAI        [Muted] Elevate Your Learning   │
│  Learning Platform   [⚙️] [🚪]                      │
│                                                     │
└─────────────────────────────────────────────────────┘

- Left: Square logo (9x9px), title, subtitle
- Right: Italic tagline, preferences, logout
- Backdrop blur effect
- Very light border (border/30)
```

### Card Pattern

```
┌──────────────────────────────┐
│ STUDY SESSIONS  (label)      │
│                              │
│  42              (number)    │
│  Scheduled this week  (meta) │
│                              │
└──────────────────────────────┘

- Light background: card/60
- Subtle border: border/40
- Minimal padding
- Clean, scannable information
```

### Feature Box Pattern (in Overview)

```
┌──────────────────────────────┐
│  📚  Study Planner           │
│  Intelligent scheduling...   │
└──────────────────────────────┘

- Background: muted/30
- Border: border/20
- Padding: p-4
- Icon: Primary color
- Title: font-medium
- Text: text-xs
```

### Quick Tips Card

```
┌──────────────────────────────┐
│  💡 Quick Tip                │
│  ────────────────            │ (decorative line)
│                              │
│  Optimal Study Duration      │
│  Research shows that 45-90   │
│  minute sessions are most... │
│                              │
│  1 of 6    [Next] [Feature]  │
└──────────────────────────────┘

- Background: accent/20
- Icon: Primary color
- Always has decorative line
```

---

## 5. SPACING & LAYOUT

### Padding System

```
Component Level:
- Header padding: py-5, px-4/6/8
- Card padding: p-4 or p-6
- Section padding: py-8

Content Level:
- Gap between items: gap-4 to gap-6
- Line height: leading-relaxed (1.6)
- Space after heading: mt-2, mb-3
```

### Responsive Grid

```
Mobile:   1 column (full-width)
Tablet:   2 columns (768px+)
Desktop:  3-4 columns (1024px+)

Example:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## 6. SHADOW SYSTEM

### Shadow Levels

```
Subtle (default cards):
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)

Medium (on hover):
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12)

Header/Footer (none):
Rely on border and background color
```

### Usage

```tsx
// Base card shadow (in CSS)
[class*="card"] {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

// Hover enhanced
[class*="card"]:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
```

---

## 7. INTERACTIVE ELEMENTS

### Button States

```
┌─ PRIMARY ─────────────────┐
│ Background: primary       │
│ Text: primary-foreground  │
│ Hover: Slight shadow      │
│ Focus: Ring outline       │
└───────────────────────────┘

┌─ OUTLINE ─────────────────┐
│ Border: primary color     │
│ Background: transparent   │
│ Hover: Slight bg tint     │
└───────────────────────────┘

┌─ GHOST ───────────────────┐
│ All transparent           │
│ Icon-only buttons         │
│ Hover: Muted bg          │
└───────────────────────────┘
```

### Input Fields

```
┌────────────────────────────┐
│ Label                      │
│ ┌──────────────────────┐   │
│ │ Placeholder text  ▼  │   │
│ └──────────────────────┘   │
│ Border: soft warm-gray     │
│ Focus: Primary ring        │
└────────────────────────────┘
```

---

## 8. FOOTER DESIGN

```
┌─────────────────────────────┐
│          ─────              │ (decorative line)
│    © 2024 LearnAI           │
│   Designed for scholarly... │
└─────────────────────────────┘

- Centered content
- Decorative line above
- Italic tagline
- Very light borders
- Backdrop blur
```

---

## 9. TEXTURE & EFFECTS

### Background Texture

```css
body {
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.02) 2px,
      rgba(0, 0, 0, 0.02) 4px
    );
}
/* Horizontal line pattern - very subtle */
```

### Card Texture

```css
.paper-texture::before {
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.01) 1px,
      rgba(0, 0, 0, 0.01) 2px
    );
}
/* Diagonal cross-hatch - nearly invisible */
```

---

## 10. COMPLETE VISUAL FLOW

### Dashboard Overview Page

```
┌──────────────────────────────────────┐
│  📖 LearnAI        [italic] [⚙️][🚪]│  ← Header
├──────────────────────────────────────┤
│                                      │
│  Welcome back                        │
│  ━━━━━━━━━━━━━                      │  ← Title + decorative line
│  Continue your learning journey...  │  ← Italic subtitle
│                                      │
├──────────────────────────────────────┤
│                                      │
│  💡 Quick Tip Card                  │  ← Tips section
│  ────────────────                   │
│  ...                                 │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ ┌─────────┐ ┌─────────┐             │
│ │SESSIONS │ │ NOTES   │  [4-column]│  ← Stats cards
│ │   42    │ │   8     │             │
│ └─────────┘ └─────────┘             │
│                                      │
├──────────────────────────────────────┤
│  Welcome to LearnAI                  │
│  ━━━━━━━━━━━━━                      │
│                                      │
│  LearnAI combines four powerful...  │
│                                      │
│  ┌─ 📚 Study Planner ───────────┐   │
│  │ Intelligent scheduling...     │   │  ← Feature boxes
│  └───────────────────────────────┘   │
│  ...                                 │
│                                      │
├──────────────────────────────────────┤
│          ─────                       │  ← Footer
│    © 2024 LearnAI                   │
│   Designed for scholarly...         │
└──────────────────────────────────────┘
```

---

## Quick Implementation Checklist

✓ All colors use OKLCH color space
✓ Dark mode mirrors light mode with warm tones
✓ Decorative lines below ALL section headings
✓ Italic taglines for descriptions
✓ Medium font-weight headings (not bold)
✓ Minimal, subtle shadows
✓ Gentle hover transitions
✓ Generous spacing (gap-4, gap-6)
✓ Paper texture overlays applied
✓ Backdrop blur on sticky elements
✓ Responsive grid layouts
✓ Accessible color contrast (7:1+)
✓ Square icon buttons (not rounded)
✓ No bright gradients used

---

## Visual Consistency Rules

1. **NEVER** use bright colors (blues, purples, oranges)
2. **ALWAYS** include decorative line under headings
3. **NEVER** use bold fonts for headings
4. **ALWAYS** use italic for taglines
5. **NEVER** use hard shadows
6. **ALWAYS** maintain warm brown/cream/sage palette
7. **NEVER** use sharp borders (use border/40 opacity)
8. **ALWAYS** include backdrop blur on overlays
9. **NEVER** use harsh contrasts
10. **ALWAYS** provide breathing room with spacing

---

## Conclusion

This paper-like aesthetic creates an interface that feels:
- **Traditional** - Scholarly and authoritative
- **Warm** - Inviting and human
- **Authentic** - Handcrafted, not digital
- **Refined** - Premium and professional
- **Calm** - Peaceful environment for learning

The combination of warm earth tones, subtle textures, medium typography, and elegant decorative elements creates a cohesive, distinctive visual identity that makes LearnAI stand out as a truly unique learning platform.
