/**
 * Hedera Token Service (HTS) - Account Balance Query Edge Function
 * 
 * Queries real-time HBAR and token balances for user accounts.
 * 
 * Use Case: Display user's INET/NRGY token balances in SUV dashboard,
 * enabling transparent tracking of earned rewards and purchased bandwidth credits.
 * 
 * Why Real-Time Queries Matter:
 * - Users see instant balance updates after earning NRGY rewards
 * - Transparent proof of token ownership (no centralized database manipulation)
 * - Supports wallet integrations (HashPack, Blade, etc.)
 * 
 * Transaction Type: AccountBalanceQuery (read-only, no fees)
 * Auth: Requires JWT (authenticated users only)
 * Network: Hedera Testnet
 * 
 * @param accountId - Hedera account ID to query (format: "0.0.XXXXXX")
 * 
 * @returns hbarBalance - HBAR balance in ℏ (native currency)
 * @returns tokenBalances - Object mapping token IDs to balances
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, PrivateKey, AccountBalanceQuery, AccountId } from "npm:@hashgraph/sdk@^2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse account ID from request
    const { accountId } = await req.json();

    console.log('Getting balance for account:', accountId);

    // Retrieve operator credentials from secure environment
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera operator credentials not configured');
    }

    // Initialize Hedera Testnet client
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Execute balance query (free operation, no transaction fee)
    const balance = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(accountId))
      .execute(client);

    // Extract HBAR balance (native currency)
    const hbarBalance = balance.hbars.toString();
    
    // Extract token balances (INET, NRGY, etc.)
    const tokenBalances: Record<string, string> = {};
    if (balance.tokens) {
      for (const [tokenId, amount] of balance.tokens.entries()) {
        tokenBalances[tokenId.toString()] = amount.toString();
      }
    }

    console.log('Balance retrieved:', { hbarBalance, tokenBalances });

    // Return structured balance data
    return new Response(
      JSON.stringify({
        success: true,
        accountId,
        hbarBalance,
        tokenBalances
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error getting balance:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
