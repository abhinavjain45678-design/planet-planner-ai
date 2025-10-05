import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, goals, budget, satelliteData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from satellite data
    const dataContext = satelliteData ? `
Current Environmental Data for ${location.name}:
- Heat Island Data: ${JSON.stringify(satelliteData.heat || 'Not available')}
- Flood Risk: ${JSON.stringify(satelliteData.flood || 'Not available')}
- Air Quality: ${JSON.stringify(satelliteData.airQuality || 'Not available')}
- Urban Growth Patterns: ${JSON.stringify(satelliteData.urbanGrowth || 'Not available')}
` : 'No satellite data available yet.';

    const systemPrompt = `You are an expert sustainable urban planning AI assistant specializing in climate-resilient zoning decisions. You analyze NASA Earth observation data, urban development constraints, and planning goals to generate optimal zoning recommendations.

Your expertise includes:
- Climate adaptation through strategic land use planning
- Green infrastructure integration
- Flood risk mitigation zoning
- Urban heat island reduction strategies
- Transit-oriented development principles
- Sustainable density planning
- Stormwater management through zoning

Provide specific, actionable recommendations backed by Earth science data.`;

    const userPrompt = `Generate comprehensive sustainable zoning recommendations for the following area:

Location: ${location.name} (Lat: ${location.lat}, Lon: ${location.lon})
Planning Goals: ${goals}
Budget Range: ${budget}

${dataContext}

Please provide:
1. PRIMARY ZONING RECOMMENDATIONS: 3-5 specific zoning changes prioritized by impact
2. GREEN SPACE STRATEGY: Where and how to expand parks, urban forests, and green corridors
3. DENSITY OPTIMIZATION: Areas where density should be increased/reduced and why
4. INFRASTRUCTURE PRIORITIES: Stormwater, cooling, flood mitigation needs
5. SCENARIO COMPARISON: Compare current zoning vs. recommended green zoning approach
6. IMPLEMENTATION ROADMAP: Phased approach considering budget constraints
7. MEASURABLE OUTCOMES: Expected improvements in heat, flood risk, air quality

Format as JSON with keys: primaryRecommendations (array), greenSpaceStrategy (object), densityOptimization (object), infrastructurePriorities (array), scenarioComparison (object), implementationRoadmap (array), measurableOutcomes (object)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Try to extract JSON from the response
    let result;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { analysis: aiResponse };
      }
    } catch (e) {
      result = { analysis: aiResponse };
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in zoning-copilot:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
