const mistral = async (content) => {
  const agentId = process.env.MISTRAL_AGENT_ID;
  const secret = process.env.MISTRAL_SECRET;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + secret);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    max_tokens: 1000,
    stream: false,
    stop: "string",
    random_seed: 0,
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    response_format: {
      type: "text",
    },
    tool_choice: "auto",
    presence_penalty: 0,
    frequency_penalty: 0,
    n: 1,
    agent_id: agentId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://api.mistral.ai/v1/agents/completions",
      requestOptions,
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = mistral;
