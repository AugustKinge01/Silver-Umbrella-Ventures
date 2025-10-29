import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, PrivateKey, TransferTransaction, AccountId, TokenId } from "npm:@hashgraph/sdk@^2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenId, fromAccountId, toAccountId, amount } = await req.json();

    console.log('Transferring HTS token:', { tokenId, fromAccountId, toAccountId, amount });

    // Get operator credentials
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

    if (!operatorId || !operatorKey) {
      throw new Error('Hedera operator credentials not configured');
    }

    // Configure client for testnet
    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Create transfer transaction
    const transferTx = await new TransferTransaction()
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(fromAccountId), -amount)
      .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(toAccountId), amount)
      .freezeWith(client);

    const transferSign = await transferTx.sign(PrivateKey.fromString(operatorKey));
    const transferSubmit = await transferSign.execute(client);
    const transferRx = await transferSubmit.getReceipt(client);

    console.log('Transfer completed:', transferRx.status.toString());

    return new Response(
      JSON.stringify({
        success: true,
        status: transferRx.status.toString(),
        transactionId: transferSubmit.transactionId.toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error transferring token:', error);
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
