/*
 * BSCTrade Event Handlers - Correct Envio Wildcard Pattern
 * Following official Envio documentation
 */

import { TokenLauncher } from "generated";

console.log("🔥 Handlers.ts loaded - using correct Envio pattern");

// Register TokenLaunched handler with wildcard mode
TokenLauncher.TokenLaunched.handler(
  async ({ event, context }) => {
    const { tokenAddress, creator, name, symbol, totalSupply } = event.params;
    
    console.log(`🚀 WILDCARD: Token Launched ${name} (${symbol}) at ${tokenAddress}`);
    console.log(`Creator: ${creator}, Total Supply: ${totalSupply}`);
    
    // Create user
    let user = await context.User.get(creator);
    if (!user) {
      const newUser = {
        id: creator,
        totalTransactions: 0n,
        totalVolumeUSD: "0",
        tokensCreated: 1n,
        tokensTraded: 0n,
        firstTransactionAt: BigInt(event.block.timestamp),
        lastTransactionAt: BigInt(event.block.timestamp),
      };
      context.User.set(newUser);
      console.log(`✅ Created new user: ${creator}`);
    } else {
      const updatedUser = {
        ...user,
        tokensCreated: user.tokensCreated + 1n,
        lastTransactionAt: BigInt(event.block.timestamp),
      };
      context.User.set(updatedUser);
      console.log(`✅ Updated user: ${creator}`);
    }
    
    // Create token
    const token = {
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
    
    context.Token.set(token);
    console.log(`✅ Created token: ${name} (${symbol})`);
    
    console.log(`🎉 TokenLaunched event processed successfully!`);
  },
  { wildcard: true }  // Enable wildcard mode here!
);

// Register ExternalTokenRegistered handler with wildcard mode
TokenLauncher.ExternalTokenRegistered.handler(
  async ({ event, context }) => {
    const { tokenAddress, registrar, name, symbol } = event.params;
    
    console.log(`📝 WILDCARD: External Token Registered ${name} (${symbol})`);
    
    // Basic processing for external tokens
    const token = {
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
    
    context.Token.set(token);
    console.log(`✅ External token registered: ${name} (${symbol})`);
  },
  { wildcard: true }  // Enable wildcard mode here!
);
