const mistral = require("./mistral");
const logger = require("./logger");

// Function to run your task
async function runTask() {
  const result = await mistral(
    "What is the best programming language for web development?",
  );

  const agentId = process.env?.MISTRAL_AGENT_ID;
  const secret = process.env?.MISTRAL_SECRET;

  logger("Task ran successfully", agentId + " " + secret);
}

// Run immediately on start
runTask();

setInterval(runTask, process.env.CRON_INTERVAL || 1000 * 60 * 60 * 3);
