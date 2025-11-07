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
    const { equipmentData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Predicting maintenance needs for:', equipmentData);

    const systemPrompt = `You are an AI expert in predictive maintenance for solar-powered telecommunications equipment.
    Analyze equipment health data and predict maintenance needs.
    
    Consider:
    - Battery health and cycles
    - Solar panel efficiency degradation
    - Temperature patterns and thermal stress
    - Power consumption trends
    - Historical failure patterns
    - Environmental factors
    
    Respond ONLY with valid JSON in this exact format:
    {
      "overallHealth": number,
      "maintenancePriority": "low" | "medium" | "high" | "critical",
      "predictedIssues": Array<{
        "component": string,
        "issue": string,
        "probability": number,
        "timeframe": string
      }>,
      "solarForecast": {
        "nextWeekGeneration": number,
        "efficiency": number,
        "weatherImpact": string
      },
      "recommendations": string[],
      "estimatedDowntime": number
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
          { role: 'user', content: JSON.stringify(equipmentData) }
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

    console.log('Maintenance prediction generated:', prediction);

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict-maintenance:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
