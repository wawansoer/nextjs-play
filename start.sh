#!/bin/sh
node /app/cron/cron.js > /app/logs/scheduler.log 2>&1 &
node server.js
