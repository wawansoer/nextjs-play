const fs = require("fs");
const path = require("path");

// Function to run your task
async function runTask() {
  const now = new Date().toISOString();
  const logMessage = `Task executed at ${now}\n`;

  fs.appendFileSync(path.join("/app/logs/scheduler.log"), logMessage);
}

// Run immediately on start
runTask();

// Then run every second
setInterval(runTask, 300000);
