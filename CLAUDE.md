# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Format code:**
```bash
npm run format
```

## Architecture Overview

This is a Next.js 14 portfolio application configured for static export (`output: 'export'` in next.config.js). The project uses:

- **App Router**: Uses Next.js 13+ app directory structure
- **Static Export**: Configured for static site generation (SSG)
- **Styling**: Tailwind CSS with custom theme configuration and dark mode support
- **Animations**: Framer Motion for page transitions and component animations
- **Theme Management**: next-themes with custom ThemeContext wrapper
- **Icons**: React Icons library

### Key Directories

- `app/`: Main application using Next.js App Router
  - `layout.js`: Root layout with theme initialization, Google Analytics, and header/footer
  - `sections/`: Page sections (introduction, about, technologies, projects)
- `components/`: Reusable UI components exported through index.js barrel files
- `constants/`: Configuration data (strings, routes, social media, technologies)
- `context/`: Theme context wrapper using next-themes
- `utils/`: Utility functions (theme config, animations, fetchers, media queries)
- `styles/`: CSS files including Tailwind base styles and component-specific styles
- `public/`: Static assets (images, SVG icons, favicon)

### Theme System

The application uses a custom theme system built on next-themes:
- Default theme is "dark" (enforced in ThemeContext and layout.js)
- Theme initialization script in layout.js prevents flash of light theme
- Custom Tailwind color scheme with brand colors and light/dark variants
- ThemeSwitcher component for user theme selection

### Component Architecture

Components follow a barrel export pattern through index.js files:
- All major components exported through `components/index.js`
- Section components exported through `app/sections/index.js`
- Constants exported through `constants/index.js`

### Styling Conventions

- Uses Tailwind CSS with custom configuration in `tailwind.config.js`
- Custom utility class `.flex-center` defined in Tailwind config
- Prettier configuration: uses tabs, 100 character line width, no trailing commas
- CSS organized into separate files: base.css, components.css, utilities.css, globals.css

### Build Configuration

- SVG files processed through @svgr/webpack for React component imports
- Images unoptimized for static export compatibility
- SWC minification enabled for production builds
