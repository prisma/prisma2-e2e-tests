#!/bin/sh

set -eux

npm install
npx prisma generate
npx tsc

# Note that it needs to be maximum 32 chars
# Azure docs: Currently when generating a default host ID we use the host name (slot host name) and we would truncate it to 32 characters max.
app="az-win-test-$(date "+%Y-%m-%d-%H%M%S")"
echo "$app" > func-tmp.txt

group="prisma-e2e-windows"
storage="prismae2ewin6owsstorage" # required because of brand foo

az functionapp create --resource-group "$group" --consumption-plan-location westeurope --name "$app" --storage-account "$storage" --runtime "node" --os-type Windows
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "DEBUG=*"
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "DATABASE_URL=$DATABASE_URL"
# https://docs.microsoft.com/en-us/azure/azure-functions/set-runtime-version?tabs=portal
# Runtime versions details at https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions?tabs=in-process%2Cazure-cli%2Cv4&pivots=programming-language-javascript#languages
# 4 = Is the "Recommended runtime version for functions in all languages." and has GA Node.js LTS
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "FUNCTIONS_EXTENSION_VERSION=~4"
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "WEBSITE_NODE_DEFAULT_VERSION=~20"

sleep 30

# give function folder our new app name
mv "func-placeholder" "$app"

npx func azure functionapp publish "$app" --force
