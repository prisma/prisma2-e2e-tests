#!/bin/sh

set -eux

# stop running GH Actions MySQL
sudo service mysql stop

# Add the Bedrock repo to apt sources for your distro:
sudo wget -O /etc/apt/sources.list.d/bedrock.list https://apt.bedrockdb.com/ubuntu/dists/$(lsb_release -cs)/bedrock.list

# Add the Bedrock repo key:
wget -O - https://apt.bedrockdb.com/bedrock.gpg | sudo apt-key add -

# Update the apt-get and install Bedrock
sudo apt-get update
sudo apt-get install bedrock

# Run it (press Ctrl^C to quit, or use -fork to make it run in the backgroud)
#bedrock -fork -db prisma/bedrock.db

# kill auto started bedrock process
sudo pkill bedrock
sleep 3

# start our own, nice one
cd prisma
ls -l
bedrock -fork -db /home/runner/work/e2e-tests/e2e-tests/databases/bedrock/prisma/bedrock.db -v

cat /var/log/syslog