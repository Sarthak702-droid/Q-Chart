---
name: Qchart Architecture
colors:
  surface: '#0e1323'
  surface-dim: '#0e1323'
  surface-bright: '#34394a'
  surface-container-lowest: '#080d1d'
  surface-container-low: '#161b2b'
  surface-container: '#1a1f30'
  surface-container-high: '#25293a'
  surface-container-highest: '#2f3446'
  on-surface: '#dee1f9'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dee1f9'
  inverse-on-surface: '#2b3041'
  outline: '#908fa0'
  outline-variant: '#464555'
  surface-tint: '#c1c1ff'
  primary: '#c1c1ff'
  on-primary: '#1300a9'
  primary-container: '#5b5ceb'
  on-primary-container: '#f5f2ff'
  inverse-primary: '#4949d9'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#ffb689'
  on-tertiary: '#512300'
  tertiary-container: '#b15500'
  on-tertiary-container: '#fff0ea'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#08006c'
  on-primary-fixed-variant: '#2f2bc1'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb689'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733500'
  background: '#0e1323'
  on-background: '#dee1f9'
  surface-variant: '#2f3446'
  surface-secondary: '#12182B'
  surface-elevated: '#1A2238'
  text-primary: '#F8FAFC'
  text-secondary: '#CBD5E1'
  text-muted: '#94A3B8'
  success: '#22C55E'
  warning: '#F59E0B'
  danger: '#EF4444'
  info: '#38BDF8'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is engineered for the next generation of high-velocity agencies, merging the precision of **Linear** with the immersive, spatial experience of **Arc**. The aesthetic is **Modern Minimalist with Glassmorphic Depth**, characterized by a dark, focused environment where data "floats" on layers of light and glass.

The UI should feel like a high-performance cockpit—utilitarian yet luxurious. It evokes a sense of "AI-first" intelligence through subtle motion, high-contrast typography, and a sophisticated use of translucency that prioritizes content over chrome.

**Design Pillars:**
- **Spatial Hierarchy:** Content is organized in distinct layers, using backdrop blurs rather than flat fills.
- **Micro-Precision:** High-density layouts with generous negative space to prevent cognitive overload.
- **Kinetic Feedback:** Every interaction feels weighted and deliberate, utilizing 3D lifts and subtle tilts to signal "intelligent" surfaces.

## Colors

The palette is anchored in a deep **Midnight Navy (#0B1020)** to minimize eye strain and maximize the vibrancy of the "Electric Indigo" primary brand color. 

- **Primary & Secondary:** Used for high-priority actions and AI-driven states. The Indigo-to-Cyan gradient (135°) should be reserved for primary call-to-actions and "magic" moments where AI is processing.
- **Surfacing:** Neutral colors are tiered by luminosity. The background is the darkest, with cards and sidebars lifting into lighter, desaturated navy tones to create depth without relying on shadows alone.
- **Typography:** Contrast ratios are strictly maintained for accessibility, using a scale from pure white for headings to muted slate for metadata.

## Typography

This design system uses a dual-font strategy. **Hanken Grotesk** (serving as a refined alternative to Satoshi/Inter Tight) provides a sharp, geometric look for display and headings, while **Inter** ensures maximum legibility for dense agency data.

- **Headings:** Feature tight letter-spacing and heavy weights to create a commanding presence.
- **Body:** Standard Inter for readability in long-form reports and chat logs.
- **Labels:** Small caps or uppercase with increased tracking are used for section headers and status chips to distinguish them from interactive text.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Navigation and toolbars reside in fixed glass containers, while the main workspace expands to fit the viewport up to 1440px.

- **Grid:** A 12-column grid is used for dashboard views, with 24px gutters.
- **Sidebar:** A fixed 280px sidebar on desktop, collapsing to a bottom sheet or hidden drawer on mobile.
- **Rhythm:** An 8px base unit drives all spacing. Elements within cards should use 16px (stack-md) padding, while card-to-card spacing should utilize 24px-32px to maintain the "spatial" feel.

## Elevation & Depth

Depth is the core differentiator of this design system. We move away from traditional shadows in favor of **Glassmorphism** and **Tonal Layering**.

- **Level 1 (Base):** The #0B1020 canvas.
- **Level 2 (Panels):** Sidebar and secondary surfaces using `rgba(255,255,255,0.05)` with a 20px blur.
- **Level 3 (Interactive):** Main cards use `rgba(255,255,255,0.08)` with a 24px blur and a subtle 1px white border at 12% opacity.
- **Level 4 (Floating):** Modals and command palettes use `rgba(255,255,255,0.12)` with a 40px blur and a deep `0 30px 80px rgba(0,0,0,0.40)` shadow.

**Inner Glow:** Use a 1px top-stroke (inset shadow) on buttons and cards to simulate light hitting the edge of glass.

## Shapes

The shape language is sophisticated and "Soft-Modern." 

- **Large Containers:** Cards and workspace areas use a 24px radius (`rounded-xl` / 1.5rem equivalent) to create a friendly, Apple-inspired frame.
- **Standard Components:** Buttons and inputs use an 8px radius (`rounded-md` / 0.5rem) for a more professional, stable feel.
- **AI Components:** Elements tagged as "AI-generated" should use pill-shaped (rounded-full) corners or a slightly higher radius than surrounding elements to denote their special status.

## Components

### Buttons
- **Primary:** 135° Indigo-to-Cyan gradient with white text. On hover, a subtle inner glow increases.
- **Ghost:** Transparent background with a 1px `rgba(255,255,255,0.1)` border. Background shifts to `rgba(255,255,255,0.05)` on hover.

### Cards & AI Widgets
- Cards must use the Glassmorphism stack defined in the Elevation section.
- **AI Widgets:** Feature a 2px "Glow" border using the secondary accent color and a subtle 3D tilt effect (2deg) on mouse-move to feel physical.

### Input Fields
- Dark backgrounds (#12182B) with 1px border. Focus state triggers a 2px Primary Indigo glow and lifts the element by 2px.

### Navigation
- Sidebar items use a "Glass Reveal" hover state—a semi-transparent white pill that follows the cursor vertically within the sidebar.

### Icons
- Use Lucide-style icons with a 2px stroke. Icons should be monochrome (Secondary Text color) unless active, where they inherit the Primary Indigo color.