/*
 * BSCTrade Token Launchpad Envio Event Handlers
 * Fixed with proper types and BigNumber handling
 */

import {
  TokenLauncher_TokenLaunched_event,
  TokenLauncher_ExternalTokenRegistered_event,
  AMMPool_TokenPurchased_event,
  AMMPool_TokenSold_event,
  AMMPool_ReservesSynced_event,
  LaunchToken_Transfer_event,
  LaunchToken_Approval_event,
  handlerContext,
} from "../generated/src/Types.gen";

import {
  Token_t,
  Transaction_t,
  User_t,
  LaunchpadStats_t,
} from "../generated/src/db/Entities.gen";

import {
  TransactionType_t,
} from "../generated/src/db/Enums.gen";

// Use the exact BigNumber from the generated dependencies
const BigNumberLib = require("../generated/node_modules/.pnpm/bignumber.js@9.1.2/node_modules/bignumber.js/bignumber");

// Constants  
const ZERO_BI = 0n;
const ONE_BI = 1n;
const ZERO_BD = new BigNumberLib(0);

// Helper to create BigDecimal_t from string or number
function toBigDecimal(value: string | number | bigint): any {
  return new BigNumberLib(value.toString());
}

// Helper to convert bigint to BigDecimal with decimals
function bigIntToBigDecimal(value: bigint, decimals: number = 18): any {
  return new BigNumberLib(value.toString()).dividedBy(new BigNumberLib(10).pow(decimals));
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
  
  // Create or update user
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
    user = newUser;
  } else {
    const updatedUser = {
      ...user,
      tokensCreated: user.tokensCreated + ONE_BI,
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(updatedUser);
  }
  
  // Create token
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
  
  // Create transaction (simplified without hash for now)
  const transaction: Transaction_t = {
    id: `${tokenAddress.toLowerCase()}-${event.block.timestamp}-${event.logIndex}`,
    hash: "0x", // Placeholder - will add proper hash later
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    token_id: tokenAddress.toLowerCase(),
    user_id: creator,
    txType: "LAUNCH" as TransactionType_t,
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
  
  // Create or update user (with proper undefined check)
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
};

// AMM Pool Handlers
export const AMMPool_TokenPurchased_handler = async ({ 
  event, 
  context 
}: {
  event: AMMPool_TokenPurchased_event;
  context: handlerContext;
}) => {
  const { buyer, tokenAmount, bnbAmount } = event.params;
  console.log(`💰 Token Purchase: ${tokenAmount} tokens for ${bnbAmount} BNB`);
  
  // Handle user with proper undefined check
  let user = await context.User.get(buyer);
  if (!user) {
    const newUser = {
      id: buyer,
      totalTransactions: ONE_BI,
      totalVolumeUSD: ZERO_BD,
      tokensCreated: ZERO_BI,
      tokensTraded: ONE_BI,
      firstTransactionAt: BigInt(event.block.timestamp),
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(newUser);
  } else {
    const updatedUser = {
      ...user,
      totalTransactions: user.totalTransactions + ONE_BI,
      tokensTraded: user.tokensTraded + ONE_BI,
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(updatedUser);
  }
  
  // Create transaction with all required fields and correct types
  const transaction: Transaction_t = {
    id: `${event.srcAddress.toLowerCase()}-${event.block.timestamp}-${event.logIndex}`,
    hash: "0x", // Placeholder
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    token_id: event.srcAddress.toLowerCase(), // Use contract address as token reference
    user_id: buyer,
    txType: "BUY" as TransactionType_t,
    tokenAmount: tokenAmount,
    bnbAmount: bnbAmount,
    tokenAmountUSD: ZERO_BD, // Will calculate later
    bnbAmountUSD: ZERO_BD,   // Will calculate later
    priceUSD: ZERO_BD,
    priceBNB: ZERO_BD,
    fromToken: ZERO_BI,
    toToken: tokenAmount,
    fromAmount: bnbAmount,
    toAmount: tokenAmount,
    fromAmountUSD: ZERO_BD,
    toAmountUSD: ZERO_BD,
  };
  
  context.Transaction.set(transaction);
};

export const AMMPool_TokenSold_handler = async ({ 
  event, 
  context 
}: {
  event: AMMPool_TokenSold_event;
  context: handlerContext;
}) => {
  const { seller, tokenAmount, bnbAmount } = event.params;
  console.log(`💸 Token Sale: ${tokenAmount} tokens for ${bnbAmount} BNB`);
  
  // Handle user with proper undefined check
  let user = await context.User.get(seller);
  if (!user) {
    const newUser = {
      id: seller,
      totalTransactions: ONE_BI,
      totalVolumeUSD: ZERO_BD,
      tokensCreated: ZERO_BI,
      tokensTraded: ONE_BI,
      firstTransactionAt: BigInt(event.block.timestamp),
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(newUser);
  } else {
    const updatedUser = {
      ...user,
      totalTransactions: user.totalTransactions + ONE_BI,
      tokensTraded: user.tokensTraded + ONE_BI,
      lastTransactionAt: BigInt(event.block.timestamp),
    };
    context.User.set(updatedUser);
  }
  
  // Create transaction
  const transaction: Transaction_t = {
    id: `${event.srcAddress.toLowerCase()}-${event.block.timestamp}-${event.logIndex}`,
    hash: "0x", // Placeholder
    blockNumber: BigInt(event.block.number),
    timestamp: BigInt(event.block.timestamp),
    token_id: event.srcAddress.toLowerCase(), // Use contract address as token reference
    user_id: seller,
    txType: "SELL" as TransactionType_t,
    tokenAmount: tokenAmount,
    bnbAmount: bnbAmount,
    tokenAmountUSD: ZERO_BD,
    bnbAmountUSD: ZERO_BD,
    priceUSD: ZERO_BD,
    priceBNB: ZERO_BD,
    fromToken: tokenAmount,
    toToken: ZERO_BI,
    fromAmount: tokenAmount,
    toAmount: bnbAmount,
    fromAmountUSD: ZERO_BD,
    toAmountUSD: ZERO_BD,
  };
  
  context.Transaction.set(transaction);
};

export const AMMPool_ReservesSynced_handler = async ({ 
  event, 
  context 
}: {
  event: AMMPool_ReservesSynced_event;
  context: handlerContext;
}) => {
  const { reserveToken, reserveBNB } = event.params;
  console.log(`🔄 Reserves Synced: ${reserveToken} tokens, ${reserveBNB} BNB`);
  
  // Calculate price with BigDecimal
  if (reserveToken > ZERO_BI) {
    const reserveTokenBN = bigIntToBigDecimal(reserveToken, 18);
    const reserveBNBBN = bigIntToBigDecimal(reserveBNB, 18);
    const price = reserveBNBBN.dividedBy(reserveTokenBN);
    
    console.log(`📈 New price: ${price.toString()} BNB per token`);
    
    // TODO: Update specific token with new reserves and price
    // Requires mapping pool address to token address
  }
};

// Basic ERC20 handlers
export const LaunchToken_Transfer_handler = async ({ 
  event, 
  context 
}: {
  event: LaunchToken_Transfer_event;
  context: handlerContext;
}) => {
  const { from, to, value } = event.params;
  console.log(`🔄 Token Transfer: ${value} from ${from} to ${to}`);
  
  // Basic transfer tracking
  // TODO: Update holder counts if needed
};

export const LaunchToken_Approval_handler = async ({ 
  event, 
  context 
}: {
  event: LaunchToken_Approval_event;
  context: handlerContext;
}) => {
  const { owner, spender, value } = event.params;
  console.log(`✅ Token Approval: ${owner} approved ${spender} for ${value}`);
  
  // Basic approval tracking
  // TODO: Track approvals for analytics if needed
};
