#!/bin/bash

cd /opt/app/backend
sudo npm install --no-audit
pm2 start all
