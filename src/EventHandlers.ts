/*
 * BSCTrade Event Handlers - Minimal Version to Get Running
 * Using correct Envio API and minimal database operations
 */

import { TokenLauncher } from "generated";

console.log("🔥 EventHandlers.ts loaded - minimal version");

// Import BigNumber from Envio's generated bindings
const BigNumber = require("../generated/node_modules/.pnpm/bignumber.js@9.1.2/node_modules/bignumber.js/bignumber");

// Create BigNumber constants
const ZERO_BD = new BigNumber(0);

// Register TokenLaunched handler - MINIMAL VERSION
TokenLauncher.TokenLaunched.handler(async ({ event, context }) => {
  const { tokenAddress, creator, name, symbol, totalSupply } = event.params;
  
  console.log(`🚀 MINIMAL: Token Launched ${name} (${symbol}) at ${tokenAddress}`);
  console.log(`Creator: ${creator}, Total Supply: ${totalSupply}`);
  
  // Just create token entity with minimal required fields
  const tokenEntity = {
    id: tokenAddress.toLowerCase(),
    address: tokenAddress.toLowerCase(),
    name: name,
    symbol: symbol,
    decimals: 18,
    totalSupply: totalSupply,
    currentPrice: ZERO_BD,        // Proper BigNumber
    priceChange24h: ZERO_BD,      // Proper BigNumber
    volume24h: ZERO_BD,           // Proper BigNumber
    volumeUSD24h: ZERO_BD,        // Proper BigNumber
    marketCap: ZERO_BD,           // Proper BigNumber
    reserveToken: 0n,
    reserveBNB: 0n,
    liquidity: ZERO_BD,           // Proper BigNumber
    creator_id: creator,
    launchedAt: BigInt(event.block.timestamp),
    isActive: true,
    ammPoolAddress: undefined,
    transactionCount: 0n,
    holderCount: 1n,
    createdAt: BigInt(event.block.timestamp),
    updatedAt: BigInt(event.block.timestamp),
  };
  
  context.Token.set(tokenEntity);
  console.log(`✅ MINIMAL: Token created successfully`);
  
}, { wildcard: true });

// Register ExternalTokenRegistered handler - MINIMAL VERSION
TokenLauncher.ExternalTokenRegistered.handler(async ({ event, context }) => {
  const { tokenAddress, registrar, name, symbol } = event.params;
  
  console.log(`📝 MINIMAL: External Token ${name} (${symbol})`);
  
  // Just log for now - minimal processing
  console.log(`✅ MINIMAL: External token logged`);
  
}, { wildcard: true });

console.log("🎉 All handlers registered with wildcard mode");
