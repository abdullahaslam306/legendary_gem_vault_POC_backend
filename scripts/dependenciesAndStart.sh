#!/bin/bash

cd /opt/app/backend
sudo npm install --no-audit
sudo pm2 start app.js