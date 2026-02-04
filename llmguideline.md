# LLM Guidelines for Checkup App

This document outlines the best practices, coding standards, and architectural guidelines for the Checkup app, an emergency check-in React Native application. These guidelines ensure consistency, maintainability, and scalability across all contributions.

## Project Overview
The Checkup app is a React Native application using Expo that allows users to set up emergency contacts and periodic check-ins. If the user fails to check in, alerts are sent to contacts via email/SMS.

## Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Local state with React hooks
- **Storage**: AsyncStorage for persistence
- **Styling**: StyleSheet with theme constants
- **Navigation**: Expo Router

## Code Organization
### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── shadcn/         # UI-specific components (e.g., icons, collapsible)
│   └── ...             # Other components (themed, external)
├── constants/          # App-wide constants
│   ├── app.ts          # General app constants
│   ├── theme.ts        # Colors and fonts
│   ├── onboarding.ts   # Onboarding-specific constants
│   ├── setup.ts        # Setup-specific constants
├── hooks/              # Custom React hooks
├── screens/            # Screen components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
    ├── alert.ts        # Alert-related utilities
    ├── storage.ts      # Data persistence
    ├── time.ts         # Time calculations
    └── timer.ts        # Timer management
```

## Coding Standards
### 1. Modularity and Separation of Concerns
- **Components**: Keep components focused on UI rendering. Extract logic to hooks or utils.
- **Utils**: Place reusable functions in `utils/`. Functions should be pure and testable.
- **Constants**: Hard-coded values (strings, numbers) go in `constants/`. Avoid magic numbers.

### 2. TypeScript Best Practices
- Use strict typing. Define interfaces for props and data structures.
- Prefer `const` assertions for arrays/objects that shouldn't change.
- Use union types for enums (e.g., `as const` for field arrays).

### 3. React Patterns
- Use functional components with hooks.
- Prefer controlled components for forms.
- Handle side effects with `useEffect`.
- Use `useCallback` for event handlers passed to children.

### 4. Constants Management
- Centralize all hard-coded values in `constants/` files.
- Group related constants (e.g., all onboarding steps together).
- Use descriptive names in SCREAMING_SNAKE_CASE.

### 5. Utility Functions
- Functions in `utils/` should be:
  - Pure (no side effects unless necessary, e.g., storage).
  - Well-documented with JSDoc.
  - Focused on a single responsibility.
- Import utilities at the top of files.

### 6. Styling
- Use `StyleSheet.create()` for performance.
- Reference colors from `Colors` constant.
- Avoid inline styles; define them in the component's `styles` object.

### 7. Error Handling
- Use try-catch for async operations.
- Show user-friendly error messages via `Alert.alert()`.
- Validate user input before processing.

### 8. Performance
- Use `useMemo` for expensive calculations.
- Optimize re-renders with `React.memo` if needed.
- Use `useCallback` for functions passed as props.

### 9. Accessibility
- Add `accessibilityLabel` to interactive elements.
- Ensure sufficient color contrast.
- Support keyboard navigation.

## Specific Guidelines
### Components
- Export default for main component, named for utilities.
- Use prop destructuring in function signatures.
- Keep components under 200 lines; split if larger.

### Screens
- Screens are top-level components for navigation.
- Handle state and business logic here.
- Delegate UI to sub-components.

### Utils
- `storage.ts`: Async functions for saving/loading data.
- `time.ts`: Date/time calculations.
- `alert.ts`: Alert sending logic.
- `timer.ts`: Background timer management.

### Constants
- `app.ts`: General app values (periods, intervals).
- `theme.ts`: Colors and fonts.
- `screen-specific.ts`: Per-screen constants (steps, options).

### Hooks
- Custom hooks for shared logic (e.g., `useThemeColor`).

## Refactoring Rules
When modifying code:
1. Identify hard-coded values and move to constants.
2. Extract repeatable logic to utils.
3. Ensure functions are modular and testable.
4. Update imports accordingly.
5. Test changes thoroughly.

## Example Patterns
### Before (Bad):
```tsx
const steps = [
  { label: 'Name', placeholder: 'Enter name' },
  // ...
];
const duration = 300;
```

### After (Good):
```tsx
// In constants/onboarding.ts
export const ONBOARDING_STEPS = [
  { label: 'Name', placeholder: 'Enter name' },
];

// In constants/app.ts
export const ANIMATION_DURATION = 300;
```

### Function Extraction:
Move logic like timer setup to `utils/timer.ts` with callbacks for updates.

### Performance Optimization:
```tsx
const MyComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data]);
  const handlePress = useCallback(() => updateData(data), [data]);

  return <TouchableOpacity onPress={handlePress}>{processedData}</TouchableOpacity>;
});
```

## Performance Guidelines
### Lazy Loading and Code Splitting
- **Expo Router**: Screens are automatically code-split and lazy-loaded by default. No additional setup needed.
- **Components**: For heavy components, use `React.lazy()` and `Suspense`:
  ```tsx
  const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
  <Suspense fallback={<Text>Loading...</Text>}>
    <HeavyComponent />
  </Suspense>
  ```

### Memoization and Optimization
- **React.memo**: Wrap components that re-render frequently with `React.memo` to prevent unnecessary renders.
- **useMemo**: Use for expensive calculations:
  ```tsx
  const calculatedValue = useMemo(() => expensiveFunction(props), [props]);
  ```
- **useCallback**: Memoize event handlers to prevent child re-renders:
  ```tsx
  const handlePress = useCallback(() => { /* logic */ }, [deps]);
  ```
- **Avoid Inline Functions**: Never define functions inline in JSX.

### List and FlatList Optimization
- **keyExtractor**: Always provide a unique `keyExtractor` for FlatList.
- **Performance Props**: Use `removeClippedSubviews={true}`, `maxToRenderPerBatch={10}`, `windowSize={5}` for large lists.
- **Memoize Render Items**: Wrap `renderItem` with `useCallback`.

### State and Effects
- **Minimize State Updates**: Batch state changes and avoid unnecessary setters.
- **useEffect Cleanup**: Always clean up timers, subscriptions, and listeners:
  ```tsx
  useEffect(() => {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [deps]);
  ```
- **Debounce Expensive Operations**: Use libraries like `lodash.debounce` for search inputs.

### Images and Assets
- **Lazy Loading**: Use `expo-image` for automatic lazy loading and caching.
- **Optimize Sizes**: Provide multiple resolutions (@2x, @3x) and use appropriate formats.
- **Preload Critical Images**: Use `Image.prefetch()` for important assets.

### Bundle Size
- **Tree Shaking**: Import only what's needed (e.g., `import { specific } from 'library'`).
- **Analyze Bundle**: Use `expo build:analyze` or similar tools to identify large dependencies.
- **Dynamic Imports**: For optional features, use dynamic imports.

### Animations
- **useNativeDriver**: Enable for better performance on native animations.
- **Avoid Over-Animation**: Limit concurrent animations to prevent jank.

## Testing
- Write unit tests for utils functions.
- Test components with React Testing Library.
- Ensure TypeScript compilation passes.

## Version Control
- Use descriptive commit messages.
- Follow conventional commits (feat:, fix:, refactor:).
- Keep PRs focused on single features.

## Maintenance
- Regularly audit for code smells.
- Update dependencies and refactor deprecated APIs.
- Document complex logic in comments or JSDoc.

By following these guidelines, we maintain a clean, scalable codebase that other LLMs and developers can easily understand and contribute to.