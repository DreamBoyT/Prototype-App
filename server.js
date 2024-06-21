const express = require("express");
const path = require("path");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const app = express();
const port = 3000;

// Set up your Azure OpenAI credentials
const endpoint = "https://chat-gpt-a1.openai.azure.com/";
const azureApiKey = "c09f91126e51468d88f57cb83a63ee36";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
const deploymentName = "Dalle3";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt, size, style, quality } = req.body;

    // Construct the prompt with style and quality
    const modifiedPrompt = `${prompt}, style: ${style}, quality: ${quality}`;

    try {
        // Request image generation from OpenAI
        const results = await client.getImages(deploymentName, modifiedPrompt, { n: 1, size });
        const imageUrls = results.data.map(image => image.url);
        res.json({ imageUrls });
    } catch (err) {
        console.error("Error generating image:", err);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
