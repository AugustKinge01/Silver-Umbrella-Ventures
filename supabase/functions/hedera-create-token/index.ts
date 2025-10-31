/**
 * Hedera Token Service (HTS) - Token Creation Edge Function
 * 
 * Creates fungible tokens (INET/NRGY) on Hedera Testnet for the SUV DePIN platform.
 * 
 * Why HTS?
 * - Fixed $0.0001 fee (vs $2-50 on Ethereum) enables profitable micro-transactions
 * - 3-5 second finality for instant voucher activation
 * - Native token service (no smart contracts = lower complexity/cost)
 * 
 * Transaction Type: TokenCreateTransaction
 * Auth: Requires JWT (authenticated users only)
 * Network: Hedera Testnet
 * 
 * @param tokenName - Human-readable name (e.g., "Silver Umbrella Internet Token")
 * @param tokenSymbol - Trading symbol (e.g., "INET")
 * @param initialSupply - Starting supply (smallest unit, considering decimals)
 * @param decimals - Decimal places (2 = 100 smallest units = 1 token)
 * @param treasuryId - Account that receives initial supply (defaults to operator)
 * 
 * @returns tokenId - Hedera token ID (format: 0.0.XXXXXX)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType } from "npm:@hashgraph/sdk@^2.75.0";

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
    // Parse request body
    const { tokenName, tokenSymbol, initialSupply, decimals, treasuryId } = await req.json();

    console.log('Creating HTS token:', { tokenName, tokenSymbol, initialSupply, decimals });

    // Retrieve operator credentials from secure environment
    // These are stored in Lovable Cloud Secrets (never committed to Git)
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera operator credentials not configured');
    }

    // Initialize Hedera Testnet client
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Build token creation transaction
    // TokenType.FungibleCommon = standard token (like ERC-20)
    // SupplyType.Infinite = can mint more later (vs Fixed supply)
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(tokenName)
      .setTokenSymbol(tokenSymbol)
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(decimals || 2)
      .setInitialSupply(initialSupply || 1000000)
      .setTreasuryAccountId(treasuryId || operatorId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setAdminKey(PrivateKey.fromString(operatorKey))  // Required for token management
      .setSupplyKey(PrivateKey.fromString(operatorKey)) // Required for minting/burning
      .freezeWith(client); // Lock transaction for signing

    // Sign transaction with operator key
    const tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(operatorKey));
    
    // Submit to Hedera network
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    
    // Wait for consensus and get receipt (includes token ID)
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateRx.tokenId;

    console.log('Token created successfully:', tokenId?.toString());

    // Return success response with token ID
    return new Response(
      JSON.stringify({
        success: true,
        tokenId: tokenId?.toString(),
        tokenName,
        tokenSymbol,
        network: 'testnet'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating token:', error);
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
