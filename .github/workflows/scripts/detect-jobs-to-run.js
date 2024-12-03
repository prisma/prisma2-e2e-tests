#!/usr/bin/env node
// @ts-check

// This was originally done in prisma/prisma repository and adapted to ecosystem
// https://github.com/prisma/prisma/blob/main/.github/workflows/detect-jobs-to-run.js

const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
const { stdin } = process

// From https://github.com/sindresorhus/get-stdin/blob/main/index.js
async function getStdin() {
  let result = ''

  if (stdin.isTTY) {
    return result
  }

  stdin.setEncoding('utf8')

  for await (const chunk of stdin) {
    result += chunk
  }

  return result
}

async function detectJobsTorun({ filesChanged, GITHUB_REF }) {
  console.debug("filesChanged", filesChanged)
  const testYamlString = fs.readFileSync(path.join(process.cwd(), '.github/workflows/test.yaml'), { encoding: 'utf8' })
  const testYaml = yaml.parse(testYamlString)
  const optionalTestYamlString = fs.readFileSync(path.join(process.cwd(), '.github/workflows/optional-test.yaml'), {
    encoding: 'utf8',
  })
  const optionalTestYaml = yaml.parse(optionalTestYamlString)
  const allJobs = { ...testYaml['jobs'], ...optionalTestYaml['jobs'] }

  // ['process-managers', 'docker', 'core-features', ...]
  const testDirectories = Object.keys(allJobs).filter((key) => {
    const jobsToIgnore = [
      'detect_jobs_to_run',         // Not a test but a job that decides which tests should run
      'report-to-slack-success',    // Not a test but a job that posts to slack
      'report-to-slack-failure',    // Not a test but a job that posts to slack
      'cleanup-runs',               // Not a test but a job that cancels previous runs
      'confirm_all_jobs_have_run',  // Not a test but a job that confirms all tests have run (for Renovate)
    ]
    return !jobsToIgnore.includes(key)
  })
  console.debug("testDirectories", testDirectories)

  // Array used as output
  const jobsToRun = []

  // fallback is to test all testDirectories
  const fallbackRunAllJobs = testDirectories

  // If we are in one of our special branches we always run all tests
  if (['refs/heads/dev', 'refs/heads/patch-dev', 'refs/heads/latest', 'refs/heads/integration'].includes(GITHUB_REF)) {
    console.debug(`GITHUB_REF=${GITHUB_REF} - special branch detected`)
    console.debug('Fallback to run all tests.')
    return fallbackRunAllJobs
  }

  // If no files changed let's fallback and run all tests
  if (filesChanged.length === 0) {
    console.debug(`filesChanged = 0, no change detected`)
    console.debug('Fallback to run all tests.')
    return fallbackRunAllJobs
  }

  // Used to know if files outside the directories have changed if so we will fallback to all
  let totalNumberOfFilesChangedInsideDirectories = 0

  /**
   * @type string[]
   **/
  for (const directoryName of testDirectories) {
    // If changes are located only in one of the directories
    const filesChangedInsideDirectory = filesChanged.filter((fileChanged) =>
      fileChanged.startsWith(`${directoryName}/`),
    )
    console.debug({ directoryName })
    console.debug({ filesChangedInsideDirectory })

    if (filesChangedInsideDirectory.length > 0) {
      // Add to total
      totalNumberOfFilesChangedInsideDirectories += filesChangedInsideDirectory.length

      // we need to run the test
      jobsToRun.push(directoryName)
    } else {
      // we don't need to run the test
    }
  }

  console.debug({ jobsToRun })
  console.debug('filesChanged.length', filesChanged.length)
  console.debug({ totalNumberOfFilesChangedInsideDirectories })

  if (totalNumberOfFilesChangedInsideDirectories != filesChanged.length) {
    console.debug('totalNumberOfFilesChangedInsideDirectories != filesChanged.length')
    console.debug('Fallback to run all tests.')
    return fallbackRunAllJobs
  } else {
    console.log('Only the following directory/ies will be tested:')
    console.log(jobsToRun)
    return jobsToRun
  }
}

async function main() {
  // Get which files changed from the action via stdin
  const stdinData = await getStdin()
  console.debug('stdin:', stdinData)

  let filesChanged = []

  if (stdinData) {
    try {
      filesChanged = JSON.parse(stdinData)
      console.debug('filesChanged:', filesChanged)
    } catch (e) {
      console.warn(`We will fallback to run all tests because there was an error while parsing stdinData: ${e}`)
    }
  } else {
    console.log(`We will fallback to run all tests because stdinData is empty.`)
  }

  const { GITHUB_REF } = process.env

  const jobsToRun = await detectJobsTorun({
    filesChanged,
    GITHUB_REF,
  })

  console.debug({ jobsToRun })
  
  if (typeof process.env.GITHUB_OUTPUT == 'string' && process.env.GITHUB_OUTPUT.length > 0) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `jobs=${JSON.stringify(jobsToRun)}\n`)
    console.debug('jobsToRun added to GITHUB_OUTPUT')
  }
}

// Only run if from command line
if (require.main === module) {
  main().then(function () {
    console.log('Done!')
  })
}

module.exports = {
  detectJobsTorun,
}
