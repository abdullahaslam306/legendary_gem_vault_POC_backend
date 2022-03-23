#!/bin/bash

cd /opt/app/backend
sudo npm install
sudo pm2 start app.js