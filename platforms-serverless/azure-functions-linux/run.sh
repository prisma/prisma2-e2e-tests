#!/bin/sh

set -eux

npm install
npx prisma generate
npx tsc

# Note that it needs to be maximum 32 chars
# Azure docs: Currently when generating a default host ID we use the host name (slot host name) and we would truncate it to 32 characters max.
app="az-linux-test-$(date "+%Y-%m-%d-%H%M%S")"
echo "$app" > func-tmp.txt

group="prisma-e2e-linux"
storage="prismae2elinuxstorage"

# Runtime versions details at https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions?tabs=in-process%2Cazure-cli%2Cv4&pivots=programming-language-javascript#languages
# 4 = Is the "Recommended runtime version for functions in all languages." and has GA Node.js LTS
az functionapp create --resource-group "$group" --consumption-plan-location westeurope --name "$app" --storage-account "$storage" --runtime "node" --os-type Linux --functions-version 4
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "DEBUG=*"
az functionapp config appsettings set --name "$app" --resource-group "$group" --settings "DATABASE_URL=$DATABASE_URL"

sleep 30

# give function folder our new app name
mv "func-placeholder" "$app"

npx func azure functionapp publish "$app" --force
