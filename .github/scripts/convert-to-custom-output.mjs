import path from 'path'
import fs from 'node:fs/promises'
import { glob } from 'glob'

const projectPath = process.argv[2]

// Evaluates to `true` when the project requires explicit `"db": "link:prisma/client"` in package.json to
// support Prisma Client's custom output.
const customOutputNeedsLinking = [
  'd1-cfpages-nuxt',
  'neon-cf-remix',
  'neon-cfpages-remix',
].some(sustring => process.cwd().includes(sustring))

// See https://github.com/prisma/ecosystem-tests/pull/5040#issuecomment-2152970656
// Add the db link to the package.json
if (customOutputNeedsLinking) {
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
  if (customOutputNeedsLinking) {
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
