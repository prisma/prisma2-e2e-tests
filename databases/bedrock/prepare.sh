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

#cd prisma 
bedrock -serverHost localhost:3000 -nodeHost localhost:3001 -controlPort localhost:3333 -mysql.host localhost:3307 -fork -clean

cat /var/log/syslog