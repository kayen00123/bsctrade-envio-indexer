/*
 * BSCTrade Event Handlers - Using Correct Envio API
 * Following the exact pattern from Envio support and docs
 */

import { TokenLauncher, User, Token } from "generated";

console.log("🔥 EventHandlers.ts loaded - using correct Envio API");

// Register TokenLaunched handler using the correct API
TokenLauncher.TokenLaunched.handler(async ({ event, context }) => {
  const { tokenAddress, creator, name, symbol, totalSupply } = event.params;
  
  console.log(`🚀 Token Launched: ${name} (${symbol}) at ${tokenAddress}`);
  
  // Create user entity
  const userId = creator;
  const currentUserEntity = await context.User.get(userId);
  
  const userEntity: User = currentUserEntity
    ? {
        ...currentUserEntity,
        tokensCreated: currentUserEntity.tokensCreated + 1n,
        lastTransactionAt: BigInt(event.block.timestamp),
      }
    : {
        id: userId,
        totalTransactions: 0n,
        totalVolumeUSD: "0",
        tokensCreated: 1n,
        tokensTraded: 0n,
        firstTransactionAt: BigInt(event.block.timestamp),
        lastTransactionAt: BigInt(event.block.timestamp),
      };
  
  context.User.set(userEntity);
  
  // Create token entity
  const tokenEntity: Token = {
    id: tokenAddress.toLowerCase(),
    address: tokenAddress.toLowerCase(),
    name: name,
    symbol: symbol,
    decimals: 18,
    totalSupply: totalSupply,
    currentPrice: "0",
    priceChange24h: "0", 
    volume24h: "0",
    volumeUSD24h: "0",
    marketCap: "0",
    reserveToken: 0n,
    reserveBNB: 0n,
    liquidity: "0",
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
  
  console.log(`✅ Token processed: ${name} (${symbol})`);
}, { wildcard: true }); // Enable wildcard mode

// Register ExternalTokenRegistered handler
TokenLauncher.ExternalTokenRegistered.handler(async ({ event, context }) => {
  const { tokenAddress, registrar, name, symbol } = event.params;
  
  console.log(`📝 External Token Registered: ${name} (${symbol})`);
  
  // Create external token
  const tokenEntity: Token = {
    id: tokenAddress.toLowerCase(),
    address: tokenAddress.toLowerCase(),
    name: name,
    symbol: symbol,
    decimals: 18,
    totalSupply: 0n,
    currentPrice: "0",
    priceChange24h: "0",
    volume24h: "0", 
    volumeUSD24h: "0",
    marketCap: "0",
    reserveToken: 0n,
    reserveBNB: 0n,
    liquidity: "0",
    creator_id: registrar,
    launchedAt: BigInt(event.block.timestamp),
    isActive: true,
    ammPoolAddress: undefined,
    transactionCount: 0n,
    holderCount: 1n,
    createdAt: BigInt(event.block.timestamp),
    updatedAt: BigInt(event.block.timestamp),
  };
  
  context.Token.set(tokenEntity);
  
  console.log(`✅ External token registered: ${name} (${symbol})`);
}, { wildcard: true }); // Enable wildcard mode
