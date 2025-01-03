const mistral = require("./mistral");
const logger = require("./logger");

// Function to run your task
async function runTask() {
  const result = await mistral(
    "What is the best programming language for web development?",
  );

  logger("Task ran successfully", JSON.stringify(result));
}

// Run immediately on start
runTask();

setInterval(runTask, process.env.CRON_INTERVAL || 1000 * 60 * 60 * 3);
