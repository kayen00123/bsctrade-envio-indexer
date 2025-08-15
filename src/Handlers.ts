/*
 * Main Handler File - Wildcard mode enabled
 * This enables indexing events from ANY contract on BSC
 */

import {
  TokenLauncher_TokenLaunched_handler,
  TokenLauncher_ExternalTokenRegistered_handler
} from './EventHandlers';

console.log("🔥 Main Handlers.ts loaded - wildcard mode enabled");

// Register handlers with wildcard mode
export const TokenLauncher = {
  TokenLaunched: {
    handler: TokenLauncher_TokenLaunched_handler,
    wildcard: true
  },
  ExternalTokenRegistered: {
    handler: TokenLauncher_ExternalTokenRegistered_handler,
    wildcard: true
  }
};
