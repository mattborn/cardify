#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { getDirectories } = require('./global')

const stub = {
  title: '',
  description: '',
  image: '',
  repo: 'mattborn/',
  tags: [],
  urls: [],
}

async function mergeWithStub(existingContent) {
  // Create a new object with stub as base, but only add missing keys
  const merged = { ...existingContent }
  for (const [key, value] of Object.entries(stub)) {
    if (!(key in merged)) {
      merged[key] = value
    }
  }
  return merged
}

function sortObjectAlphabetically(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
}

async function initAbout(dirPath, dryRun = false) {
  try {
    const aboutPath = path.join(dirPath, 'ABOUT.json')
    let needsUpdate = false
    let existingContent = {}

    try {
      const content = await fs.readFile(aboutPath, 'utf8')
      if (!content || content.trim() === '' || content.trim() === '{}') {
        needsUpdate = true
      } else {
        existingContent = JSON.parse(content)
        // Check if any stub keys are missing
        needsUpdate = Object.keys(stub).some(key => !(key in existingContent))
      }
    } catch (err) {
      needsUpdate = true
    }

    if (needsUpdate) {
      const updatedContent = sortObjectAlphabetically(await mergeWithStub(existingContent))
      if (dryRun) {
        console.log(`Would update ${aboutPath} with:`)
        console.log(JSON.stringify(updatedContent, null, 2))
      } else {
        await fs.writeFile(aboutPath, JSON.stringify(updatedContent, null, 2))
        console.log(`Updated ABOUT.json in ${dirPath}`)
      }
    } else if (dryRun) {
      console.log(`No updates needed for ${aboutPath}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function main() {
  try {
    const dryRun = process.argv.includes('--dry')
    if (dryRun) {
      console.log('Performing dry run - no files will be modified\n')
    }

    const currentDir = process.cwd()
    const directories = await getDirectories(currentDir)
    await Promise.all(directories.map(dir => initAbout(path.join(currentDir, dir), dryRun)))
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
