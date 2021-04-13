#!/bin/sh

set -eux

# Add the Bedrock repo to apt sources for your distro:
sudo wget -O /etc/apt/sources.list.d/bedrock.list https://apt.bedrockdb.com/ubuntu/dists/$(lsb_release -cs)/bedrock.list

# Add the Bedrock repo key:
wget -O - https://apt.bedrockdb.com/bedrock.gpg | sudo apt-key add -

# Update the apt-get and install Bedrock
sudo apt-get update
sudo apt-get install bedrock

# Create an empty database (See: https://github.com/Expensify/Bedrock/issues/489)
touch bedrock.db

# Run it (press Ctrl^C to quit, or use -fork to make it run in the backgroud)
bedrock -fork
