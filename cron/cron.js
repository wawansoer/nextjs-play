const fs = require("fs");
const path = require("path");

// Function to run your task
async function runTask() {
  const cronInterval = process.env.CRON_INTERVAL || 300000;
  const now = new Date().toISOString();
  const logMessage = `Task executed at ${now} ${cronInterval}\n`;

  fs.appendFileSync(path.join("/app/logs/scheduler.log"), logMessage);
}

// Run immediately on start
runTask();

setInterval(runTask, 300000);
