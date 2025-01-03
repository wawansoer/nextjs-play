const fs = require("fs");
const path = require("path");

const logger = (message, additionalInfo) => {
  const now = new Date().toISOString();
  const logMessage = `${now} : ${message}\n ${additionalInfo} \n`;
  fs.appendFileSync(path.join("/app/logs/scheduler.log"), logMessage);
};

module.exports = logger;
