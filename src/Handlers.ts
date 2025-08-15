/*
 * Main Handler File - Imports and exports all event handlers
 * This is the file referenced in config.yaml
 */

// Import all handlers from EventHandlers.ts
export {
  TokenLauncher_TokenLaunched_handler,
  TokenLauncher_ExternalTokenRegistered_handler
} from './EventHandlers';

console.log("🔥 Main Handlers.ts loaded - all handlers exported");
