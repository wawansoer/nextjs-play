#!/bin/sh
cd /app
node ./cron/cron.js > /app/logs/scheduler.log 2>&1 &
node server.js
