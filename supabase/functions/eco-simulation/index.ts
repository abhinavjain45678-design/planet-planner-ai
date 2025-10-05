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
    const { simulationType, parameters, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (simulationType) {
      case "tree_planting":
        systemPrompt = `You are an environmental impact analyst specializing in urban forestry and climate science. Use NASA Earth observation data principles and scientific models to predict outcomes.`;
        userPrompt = `Analyze the impact of planting ${parameters.treeCount} trees in ${location.name || 'the selected area'} (lat: ${location.lat}, lon: ${location.lon}).

Consider:
- CO2 sequestration over ${parameters.timeframe} years
- Urban heat island reduction (temperature decrease in °C)
- Air quality improvement (PM2.5 and NO2 reduction)
- Stormwater management (runoff reduction)
- Biodiversity impact

Provide specific numerical predictions with scientific reasoning. Format as JSON with keys: co2Sequestration, temperatureReduction, airQualityImprovement, stormwaterBenefit, biodiversityScore, longTermOutlook.`;
        break;

      case "wetland":
        systemPrompt = `You are a wetland ecologist and urban planner analyzing environmental trade-offs using satellite data and ecological models.`;
        userPrompt = `Compare the outcomes of ${parameters.action} ${parameters.area} hectares of wetland in ${location.name || 'the selected area'}.

Analyze:
- Flood mitigation capacity (m³ of water storage)
- Carbon storage impact (tonnes CO2)
- Biodiversity and habitat value
- Water quality filtration
- Economic development vs. ecological services trade-off

Provide quantitative analysis. Format as JSON with keys: floodMitigation, carbonStorage, biodiversityImpact, waterQuality, economicTradeoff, recommendation.`;
        break;

      case "emissions":
        systemPrompt = `You are an air quality scientist and climate policy analyst using atmospheric modeling and NASA satellite data principles.`;
        userPrompt = `Model the impact of reducing industrial emissions by ${parameters.reductionPercent}% in ${location.name || 'the selected area'} over ${parameters.timeframe} years.

Calculate:
- Air quality index improvement
- Public health benefits (reduced respiratory illnesses)
- Climate impact (CO2 reduction in tonnes)
- Economic costs vs. health savings
- Atmospheric pollutant reduction (NO2, SO2, PM2.5)

Use Sentinel-5P and NASA data principles. Format as JSON with keys: aqiImprovement, healthBenefits, co2Reduction, economicAnalysis, pollutantReduction, longTermImpact.`;
        break;

      case "transit_housing":
        systemPrompt = `You are an urban sustainability planner analyzing transit-oriented development using satellite imagery patterns and urban science.`;
        userPrompt = `Evaluate building ${parameters.housingUnits} housing units within ${parameters.transitDistance}m of transit in ${location.name || 'the selected area'}.

Assess:
- Transportation emissions reduction (tonnes CO2/year)
- Traffic congestion impact
- Land use efficiency
- Quality of life metrics
- Urban sprawl prevention
- Economic viability

Format as JSON with keys: emissionsReduction, congestionImpact, landUseEfficiency, qualityOfLife, sprawlPrevention, feasibility.`;
        break;
    }

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
      // Look for JSON in the response
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
    console.error("Error in eco-simulation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
