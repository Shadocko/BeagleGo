#!/bin/bash

cd `dirname $0`
NODE_PATH=/usr/local/lib/node_modules
HOME=/root
LOGNAME=root

ret=1
while [ $ret -ne 0 ]
do
  node server.js >> server.log 2>&1 || ret=$?
done
