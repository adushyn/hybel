# Hybel Portfolio - Angular 17 Project

## Project Overview

This is an Angular 17 standalone application built with modern best practices and no NgModules.

## Technology Stack

- **Angular**: 17.3.x
- **TypeScript**: Strict mode enabled
- **Angular Material**: 17.3.x with Indigo Pink theme
- **Styling**: SCSS
- **Change Detection**: OnPush strategy by default
- **State Management**: Signals (no NgRx)

## Project Configuration

### TypeScript
- Strict mode enabled
- All strict flags activated
- Strict template checking enabled

### Components
- All components are standalone
- OnPush change detection strategy
- Signal-based state management
- No NgModule dependencies

### Styling
- SCSS preprocessor
- Angular Material theming
- Component-scoped styles

## Project Structure

```
src/
├── app/
│   ├── features/           # Feature modules
│   │   └── portfolio/      # Portfolio feature
│   ├── app.component.ts    # Root component (OnPush)
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Route configuration
├── assets/                 # Static assets
└── styles.scss            # Global styles
```

## Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Build for development
ng build --configuration development

# Run tests
ng test

# Run linting
ng lint
```

## Features

### Portfolio Feature
Self-contained feature demonstrating:
- Standalone component architecture
- Lazy loading
- Material Design components
- Signal-based state management
- OnPush change detection
- Routing with parameters

## Best Practices Implemented

1. **Standalone Components**: No NgModule boilerplate
2. **OnPush Change Detection**: Optimized performance
3. **Signals**: Modern reactive programming
4. **Strict TypeScript**: Enhanced type safety
5. **Feature Folders**: Organized code structure
6. **Lazy Loading**: Optimized bundle size
7. **Public APIs**: Clean exports via index files

## Adding New Features

1. Create a new feature folder under `src/app/features/`
2. Follow the portfolio feature structure
3. Use standalone components with OnPush
4. Export public API through `index.ts`
5. Add feature routes to main `app.routes.ts`
6. Use lazy loading for better performance

## Material Design

Material Design is configured with:
- Indigo Pink theme
- Typography enabled
- Animations enabled

To customize the theme, edit `src/styles.scss`.

## Notes

- No state management library (NgRx) - using Angular Signals
- All components use ChangeDetectionStrategy.OnPush
- Feature folders are self-contained and reusable
- Lazy loading is used for all feature routes
