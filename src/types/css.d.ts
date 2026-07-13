// TypeScript 6+ requires a module declaration for side-effect CSS imports
// (e.g. `import "./globals.css"` in layout.tsx); TS 5.x silently allowed them.
declare module "*.css";
