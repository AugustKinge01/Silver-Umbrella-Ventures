import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nodeData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing node performance for:', nodeData);

    const systemPrompt = `You are an AI expert in analyzing solar-powered internet infrastructure nodes for a dePIN network. 
    Analyze the provided node data and predict:
    1. Performance score (0-100)
    2. Expected uptime percentage for next 7 days
    3. Bandwidth capacity utilization forecast
    4. Risk factors and recommendations
    5. Optimal maintenance window
    
    Respond ONLY with valid JSON in this exact format:
    {
      "performanceScore": number,
      "predictedUptime": number,
      "bandwidthForecast": {
        "current": number,
        "predicted": number,
        "trend": "increasing" | "stable" | "decreasing"
      },
      "riskFactors": string[],
      "recommendations": string[],
      "maintenanceWindow": string
    }`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(nodeData) }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const prediction = JSON.parse(data.choices[0].message.content);

    console.log('Prediction generated:', prediction);

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict-node-performance:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
