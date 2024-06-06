import path from 'path'
import fs from 'node:fs/promises'
import { glob } from 'glob'

const projectPath = '/Users/j42/Dev/ecosystem-tests/driver-adapters-wasm/d1-cfpages-nuxt'

// See https://github.com/prisma/ecosystem-tests/pull/5040#issuecomment-2152970656
const isD1CfPagesNuxt = projectPath.includes('d1-cfpages-nuxt')

// Add the db link to the package.json
if (isD1CfPagesNuxt) {
  const packageJson = JSON.parse(await fs.readFile(path.join(projectPath, 'package.json'), 'utf8'))
  packageJson.dependencies['db'] = 'link:prisma/client'
  fs.writeFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')
}

const schemaFile = path.join(projectPath, 'prisma', 'schema.prisma')
await replaceInFile(schemaFile, /provider\s*=\s*"prisma-client-js"/, '$&\noutput="client"')

const sourceFiles = glob.stream('**/*.{js,mjs,ts,mts}', {
  cwd: projectPath,
  absolute: true,
  nodir: true,
  ignore: ['node_modules/**', '*test*'],
})

let numFiles = 0
for await (const file of sourceFiles) {
  let relImport = path.relative(path.dirname(file), path.join(projectPath, 'prisma', 'client'))
  if (!relImport.startsWith('.')) {
    relImport = `./${relImport}`
  }
  if (isD1CfPagesNuxt) {
    // Replace '@prisma/client' with 'db'
    await replaceInFile(file, /@prisma\/client/g, 'db')
  } else {
    await replaceInFile(file, /@prisma\/client/g, relImport)
  }
  numFiles++
}

if (numFiles > 0) {
  console.log('javascript files were correctly modified for the custom output project')
} else {
  console.error('javascript files were not correctly modified for the custom output project')
  process.exitCode = 1
}

async function replaceInFile(absolutePath, pattern, replacement) {
  const contents = await fs.readFile(absolutePath, 'utf8')
  if (/output="client"/.test(contents)) {
    console.log(`output="client" already present in ${absolutePath} -> we can skip.`)
    return
  }
  await fs.writeFile(absolutePath, contents.replace(pattern, replacement))
}
