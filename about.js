#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { getDirectories } = require('./global')

const stub = {
  title: '',
  description: '',
  image: '',
  tags: [],
}


async function initAbout(dirPath) {
  try {
    const aboutPath = path.join(dirPath, 'ABOUT.json')
    let needsStub = false

    try {
      const content = await fs.readFile(aboutPath, 'utf8')
      needsStub = !content || content.trim() === '' || content.trim() === '{}'
    } catch (err) {
      needsStub = true
    }

    if (needsStub) {
      await fs.writeFile(aboutPath, JSON.stringify(stub, null, 2))
      console.log(`Created ABOUT.json in ${dirPath}`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function main() {
  try {
    const currentDir = process.cwd()
    const directories = await getDirectories(currentDir)
    await Promise.all(
      directories.map(dir => initAbout(path.join(currentDir, dir)))
    )
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
