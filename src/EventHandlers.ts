/*
 * BSCTrade Token Launchpad Envio Event Handlers
 * Debug version to ensure handlers are properly registered
 */

console.log("🔥 EventHandlers.ts loaded - handlers should be available");

import {
  TokenLauncher_TokenLaunched_event,
  TokenLauncher_ExternalTokenRegistered_event,
  handlerContext,
} from "../generated/src/Types.gen";

import {
  TransactionType_t,
} from "../generated/src/db/Enums.gen";

// Try to use Envio's built-in BigNumber from the dependencies
const BigNumberLib = require("../generated/node_modules/.pnpm/bignumber.js@9.1.2/node_modules/bignumber.js/bignumber");

// Constants with proper BigNumber types
const ZERO_BI = 0n;
const ONE_BI = 1n;
const ZERO_BD = new BigNumberLib(0);

// Helper to create BigNumber from string or number
function toBigNumber(value: string | number | bigint): any {
  return new BigNumberLib(value.toString());
}

// Token Launched Handler
export const TokenLauncher_TokenLaunched_handler = async ({ 
  event, 
  context 
}: {
  event: TokenLauncher_TokenLaunched_event;
  context: handlerContext;
}) => {
  const { tokenAddress, creator, name, symbol, totalSupply } = event.params;
  
  console.log(`🚀 Token Launched: ${name} (${symbol}) at ${tokenAddress}`);
  
  // Create user with proper BigNumber types
  let user = await context.User.get(creator);
  if (!user) {
    const newUser = {
      id: creator,
      totalTransactions: ZERO_BI,
      totalVolumeUSD: ZERO_BD,
      tokensCreated: ONE_BI,
      tokensTraded: ZERO_BI,
      firstTransactionAt: BigInt(event.block.timestamp),
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(newUser);
  } else {
    const updatedUser = {
      ...user,
      tokensCreated: user.tokensCreated + ONE_BI,
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(updatedUser);
  }
  
  // Create token with proper BigNumber types
  const token = {
    id: tokenAddress.toLowerCase(),
    address: tokenAddress.toLowerCase(),
    name: name,
    symbol: symbol,
    decimals: 18,
    totalSupply: totalSupply,
    currentPrice: ZERO_BD,
    priceChange24h: ZERO_BD,
    volume24h: ZERO_BD,
    volumeUSD24h: ZERO_BD,
    marketCap: ZERO_BD,
    reserveToken: ZERO_BI,
    reserveBNB: ZERO_BI,
    liquidity: ZERO_BD,
    creator_id: creator,
    launchedAt: BigInt(event.block.timestamp),
    isActive: true,
    ammPoolAddress: undefined,
    transactionCount: ZERO_BI,
    holderCount: ONE_BI,
    createdAt: BigInt(event.block.timestamp),
    updatedAt: BigInt(event.block.timestamp),
  };
  
  context.Token.set(token);
  
  // Create transaction with proper enum type
  const transaction = {
    id: `${tokenAddress.toLowerCase()}-${event.block.timestamp}-${event.logIndex}`,
    hash: "0x",
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    token_id: tokenAddress.toLowerCase(),
    user_id: creator,
    txType: "LAUNCH" as TransactionType_t, // Proper enum cast
    tokenAmount: totalSupply,
    bnbAmount: ZERO_BI,
    tokenAmountUSD: ZERO_BD,
    bnbAmountUSD: ZERO_BD,
    priceUSD: ZERO_BD,
    priceBNB: ZERO_BD,
    fromToken: ZERO_BI,
    toToken: totalSupply,
    fromAmount: ZERO_BI,
    toAmount: totalSupply,
    fromAmountUSD: ZERO_BD,
    toAmountUSD: ZERO_BD,
  };
  
  context.Transaction.set(transaction);
  
  // Update platform stats
  let stats = await context.LaunchpadStats.get("1");
  if (!stats) {
    const newStats = {
      id: "1",
      totalTokens: ONE_BI,
      totalTransactions: ONE_BI,
      totalVolumeUSD: ZERO_BD,
      totalUsers: ONE_BI,
      tokensToday: ONE_BI,
      volumeToday: ZERO_BD,
      transactionsToday: ONE_BI,
      lastUpdated: BigInt(event.block.timestamp),
    };
    context.LaunchpadStats.set(newStats);
  } else {
    const updatedStats = {
      ...stats,
      totalTokens: stats.totalTokens + ONE_BI,
      totalTransactions: stats.totalTransactions + ONE_BI,
      lastUpdated: BigInt(event.block.timestamp),
    };
    context.LaunchpadStats.set(updatedStats);
  }
  
  console.log(`✅ Token indexed: ${name} (${symbol})`);
};

// External Token Registered Handler
export const TokenLauncher_ExternalTokenRegistered_handler = async ({ 
  event, 
  context 
}: {
  event: TokenLauncher_ExternalTokenRegistered_event;
  context: handlerContext;
}) => {
  const { tokenAddress, registrar, name, symbol } = event.params;
  
  console.log(`📝 External Token Registered: ${name} (${symbol})`);
  
  // Create user
  let user = await context.User.get(registrar);
  if (!user) {
    const newUser = {
      id: registrar,
      totalTransactions: ZERO_BI,
      totalVolumeUSD: ZERO_BD,
      tokensCreated: ONE_BI,
      tokensTraded: ZERO_BI,
      firstTransactionAt: BigInt(event.block.timestamp),
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(newUser);
  } else {
    const updatedUser = {
      ...user,
      tokensCreated: user.tokensCreated + ONE_BI,
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(updatedUser);
  }
  
  // Create external token
  const token = {
    id: tokenAddress.toLowerCase(),
    address: tokenAddress.toLowerCase(),
    name: name,
    symbol: symbol,
    decimals: 18,
    totalSupply: ZERO_BI,
    currentPrice: ZERO_BD,
    priceChange24h: ZERO_BD,
    volume24h: ZERO_BD,
    volumeUSD24h: ZERO_BD,
    marketCap: ZERO_BD,
    reserveToken: ZERO_BI,
    reserveBNB: ZERO_BI,
    liquidity: ZERO_BD,
    creator_id: registrar,
    launchedAt: BigInt(event.block.timestamp),
    isActive: true,
    ammPoolAddress: undefined,
    transactionCount: ZERO_BI,
    holderCount: ONE_BI,
    createdAt: BigInt(event.block.timestamp),
    updatedAt: BigInt(event.block.timestamp),
  };
  
  context.Token.set(token);
  
  console.log(`✅ External token registered: ${name} (${symbol})`);
};
