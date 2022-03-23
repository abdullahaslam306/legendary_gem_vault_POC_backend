#!/bin/bash

cd /opt/app
sudo npm install
sudo pm2 start app.js