require("dotenv").config();

const fetch = require("node-fetch");

// Utility function to generate headers
const generateHeaders = (secret) => ({
  Authorization: `Bearer ${secret}`,
  "Content-Type": "application/json",
});

// Blog categories array
const BLOG_CATEGORIES = [
  "General",
  "Tech",
  "Business",
  "Entertainment",
  "Health",
  "Science",
];

// Function to get a random blog category
const getRandomBlogCategory = () =>
  BLOG_CATEGORIES[Math.floor(Math.random() * BLOG_CATEGORIES.length)];

// Main function to interact with the Mistral API
const mistral = async () => {
  const agentId = process.env.MISTRAL_AGENT_ID || "";
  const secret = process.env.MISTRAL_SECRET_KEY || "";

  const headers = generateHeaders(secret);

  const payload = {
    max_tokens: 5000,
    tool_choice: "auto",
    presence_penalty: 0,
    frequency_penalty: 0,
    n: 1,
    stream: false,
    response_format: { type: "text" },
    agent_id: agentId,
    messages: [
      {
        role: "user",
        content: getRandomBlogCategory(),
      },
    ],
  };

  try {
    const response = await fetch(
      "https://api.mistral.ai/v1/agents/completions",
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(errorDetails);
      return errorDetails;
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Failed to fetch from Mistral API:", error.message);
    return error.message;
  }
};

module.exports = mistral;
