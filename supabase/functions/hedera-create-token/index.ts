import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType } from "npm:@hashgraph/sdk@^2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenName, tokenSymbol, initialSupply, decimals, treasuryId } = await req.json();

    console.log('Creating HTS token:', { tokenName, tokenSymbol, initialSupply, decimals });

    // Get operator credentials from environment
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera operator credentials not configured');
    }

    // Configure client for testnet
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Create the token
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(tokenName)
      .setTokenSymbol(tokenSymbol)
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(decimals || 2)
      .setInitialSupply(initialSupply || 1000000)
      .setTreasuryAccountId(treasuryId || operatorId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setAdminKey(PrivateKey.fromString(operatorKey))
      .setSupplyKey(PrivateKey.fromString(operatorKey))
      .freezeWith(client);

    const tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(operatorKey));
    const tokenCreateSubmit = await tokenCreateSign.execute(client);
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
    const tokenId = tokenCreateRx.tokenId;

    console.log('Token created successfully:', tokenId?.toString());

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
