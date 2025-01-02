#!/bin/sh
/usr/sbin/crond -f -l 8 &
node server.js
