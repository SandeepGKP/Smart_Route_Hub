const { GoogleGenerativeAI } = require("@google/generative-ai");
const Vendor = require("../models/Vendor");

exports.suggestRoutingConfig = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        // Fetch live database metrics to give the AI real-world context
        const liveVendors = await Vendor.find().select('name metrics capability costPerRequest priority weight timeoutMs');
        const liveContext = JSON.stringify(liveVendors);

        // Requires GEMINI_API_KEY in .env
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

        const systemInstruction = `
        You are an advanced Agentic AI for an Intelligent Vendor Routing Platform.
        Here is the LIVE database state of the routing vendors and their current health metrics:
        ${liveContext}
        
        You must act as a routing expert using the live data above. Your capabilities include:
        1. Recommending the best routing strategy.
        2. Explaining why a vendor was selected.
        3. Detecting unhealthy vendors from logs/metrics.
        4. Suggesting fallback rules.
        5. Generating routing configurations from plain English.
        
        You MUST ALWAYS return your response as a single, valid JSON object without any markdown formatting.
        The JSON object must have this exact structure:
        {
          "agent_response": "Your natural language explanation, recommendation, or analysis goes here.",
          "generated_config": { ... optional JSON object if the user asked you to generate a configuration ... }
        }
        
        If generating a vendor config, you MUST extract the actual requested values from the user's prompt. Use this exact structure for generated_config (use sensible defaults only if the user omits a field):
        { "capability": "String", "name": "String", "weight": Number, "costPerRequest": Number, "timeoutMs": Number, "priority": Number }
        `;

        const result = await model.generateContent(`${systemInstruction}\n\nUser Request: ${prompt}`);
        const text = result.response.text();

        // Basic JSON parsing cleanup
        const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonConfig = JSON.parse(cleanJson);

        res.status(200).json({
            message: "AI generated configuration successfully",
            config: jsonConfig
        });
    } catch (error) {
        res.status(500).json({ error: "AI Error: " + error.message });
    }
};
