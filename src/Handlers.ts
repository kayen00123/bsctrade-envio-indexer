/*
 * Minimal Handler File - Just one event for testing
 */

import {
  TokenLauncher_TokenLaunched_event,
  handlerContext,
} from "../generated/src/Types.gen";

console.log("🔥 Minimal Handlers.ts loaded");

// Minimal TokenLaunched handler
export const TokenLauncher_TokenLaunched_handler = async ({ 
  event, 
  context 
}: {
  event: TokenLauncher_TokenLaunched_event;
  context: handlerContext;
}) => {
  const { tokenAddress, creator, name, symbol, totalSupply } = event.params;
  
  console.log(`🚀 MINIMAL TEST: Token Launched ${name} (${symbol}) at ${tokenAddress}`);
  
  // Just log the event - no database operations for now
  console.log(`✅ Event processed successfully!`);
};
