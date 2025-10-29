import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, PrivateKey, AccountBalanceQuery, AccountId } from "npm:@hashgraph/sdk@^2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountId } = await req.json();

    console.log('Getting balance for account:', accountId);

    // Get operator credentials
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera operator credentials not configured');
    }

    // Configure client for testnet
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Query balance
    const balance = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(accountId))
      .execute(client);

    const hbarBalance = balance.hbars.toString();
    const tokenBalances: Record<string, string> = {};
    
    balance.tokens?.forEach((amount, tokenId) => {
      tokenBalances[tokenId.toString()] = amount.toString();
    });

    console.log('Balance retrieved:', { hbarBalance, tokenBalances });

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
