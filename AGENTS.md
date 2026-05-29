# Quartz AGENTS.md

## Build / Lint / Test Commands

### Testing

- Run all tests: `npm test` (uses tsx Node.js test runner)
- Run single test: `tsx --test <path-to-test-file>` (e.g., `tsx --test quartz/util/path.test.ts`)

### Type Checking & Linting

- Check types and formatting: `npm run check` (runs `tsc --noEmit && npx prettier . --check`)
- Format code: `npm run format` (runs `npx prettier . --write`)

### Build

- Build site: `npx quartz build`
- Build with dev server: `npx quartz build --serve`
- Full docs build: `npm run docs`

## Code Style Guidelines

### Formatting (Prettier)

- Line width: 100 characters
- Indentation: 2 spaces (tabs: false)
- Semicolons: false (no trailing semicolons)
- Trailing commas: all (always include trailing commas)
- Quote properties: as-needed

### TypeScript Configuration

- Strict mode enabled
- Target: ESNext
- Module: ESNext with Node resolution
- JSX: react-jsx with preact import source
- `noUnusedLocals` and `noUnusedParameters` enabled
- `forceConsistentCasingInFileNames` enabled

### Naming Conventions

- Functions/Variables: `camelCase`
- Components: `PascalCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE` or `camelCase`
- Plugin names: `PascalCase` (e.g., `GitHubFlavoredMarkdown`)
- File extensions: `.ts` for code, `.tsx` for JSX, `.test.ts` for tests

### Import Style

- Group imports: external dependencies first, then internal imports
- Use named imports for type imports: `import { type FilePath } from "./path"`
- Prefer explicit imports over wildcard imports
- Example:
  ```ts
  import remarkGfm from "remark-gfm"
  import { QuartzTransformerPlugin } from "../types"
  import { BuildCtx } from "../util/ctx"
  ```

### Component Pattern

Components must be defined and exported using the `QuartzComponentConstructor` pattern:

```ts
const Component: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  return <div>{fileData.frontmatter?.title}</div>
}

Component.css = `.component { color: red; }`

export default (() => Component) satisfies QuartzComponentConstructor<Options>
```

### Plugin Pattern

Plugins use a factory function that returns a plugin instance:

```ts
export const PluginName: QuartzTransformerPlugin<Options> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "PluginName",
    markdownPlugins: (ctx) => [...],
    htmlPlugins: (ctx) => [...],
    externalResources: (ctx) => ({ css: [], js: [] }),
  }
}
```

### Type Safety

- Use branded types for nominal typing: `type SlugLike<T> = string & { __brand: T }`
- Prefer type guards over type assertions
- Use `satisfies` for type validation without widening
- Type assertions are discouraged; use explicit typing or type guards

### Error Handling

- Use try-catch blocks for async operations
- Use `trace()` utility from `../util/trace` for error logging
- Example:
  ```ts
  try {
    await processFile(fp)
  } catch (err) {
    trace(`Failed to process \`${fp}\``, err as Error)
  }
  ```

### Testing Pattern

- Use Node.js built-in test runner with `tsx`
- Import test utilities: `import test, { describe, beforeEach } from "node:test"`
- Use `assert` from "node:assert"
- Structure tests with `describe()` blocks and `test()` functions
- Use `beforeEach()` for test setup

### JSX/Preact Specifics

- Use `class` not `className` for CSS classes (Preact/Hast)
- Fragment syntax: `<>...</>` or `<></>`
- Use `null` to return nothing from components
- Conditional rendering: `condition ? <Element /> : null`

### File Organization

- Components: `quartz/components/`
- Plugins: `quartz/plugins/transformers/`, `quartz/plugins/filters/`, `quartz/plugins/emitters/`
- Processors: `quartz/processors/`
- Utilities: `quartz/util/`
- Test files co-located: `path.test.ts` alongside `path.ts`

### Comments

- No comments unless necessary (per project culture)
- Use JSDoc for exported public APIs only when needed
- Avoid inline explanations of obvious code
