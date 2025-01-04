var cron = require('node-cron');
const mistral = require("./mistral");

const cronExpression = process.env.CRON_EXPRESSION || '* * * * *';

cron.schedule(cronExpression, () => {
  console.log("Cron job is running", "");

  const response = mistral();
  response.then((res) => {
    console.log("Cron job completed", res);
  }).catch((err) => {
    console.log("Cron job failed", err);
  });
});
