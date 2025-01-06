var cron = require("node-cron");
var mistral = require("./mistral");

const main = () => {
  cron.schedule("* * * * *", () => {
    console.info(`${new Date().toISOString()} : Running cron job`);
    console.log(mistral());
  });
};

main();
