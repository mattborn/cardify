#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { getDirectories } = require('./global')

async function getFileTimes(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    let latestTime = 0
    let creationTime = Infinity

    // Check each entry
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const stats = await fs.stat(fullPath)

      // Update latestTime if this file/directory is more recent
      if (stats.mtime.getTime() > latestTime) {
        latestTime = stats.mtime.getTime()
      }

      // Update creationTime if this file/directory is older
      if (stats.birthtime.getTime() < creationTime) {
        creationTime = stats.birthtime.getTime()
      }
    }

    if (latestTime === 0 || creationTime === Infinity) {
      return { created: null, modified: null }
    }

    // Format as YYYY-MM-DD HH:mm:ss
    return {
      created: new Date(creationTime).toISOString().replace('T', ' ').split('.')[0],
      modified: new Date(latestTime).toISOString().replace('T', ' ').split('.')[0],
    }
  } catch (error) {
    console.warn(`Error getting file times for ${dirPath}:`, error)
    return { created: null, modified: null }
  }
}

async function readAboutFile(dirPath) {
  try {
    const filePath = path.join(dirPath, 'ABOUT.json')
    const data = await fs.readFile(filePath, 'utf8')
    const times = await getFileTimes(dirPath)

    return {
      ...JSON.parse(data),
      path: path.basename(dirPath),
      created: times.created,
      lastModified: times.modified,
    }
  } catch (error) {
    console.warn(`No ABOUT.json found in ${dirPath}`)
    return null
  }
}

async function main() {
  try {
    const currentDir = process.cwd()
    const directories = await getDirectories(currentDir)

    const cards = (await Promise.all(directories.map(dir => readAboutFile(path.join(currentDir, dir))))).filter(Boolean)

    await fs.writeFile(path.join(currentDir, 'cards.json'), JSON.stringify(cards, null, 2))

    console.log('Successfully generated cards.json')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
