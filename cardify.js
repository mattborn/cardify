#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { getDirectories } = require('./global');

async function readAboutFile(dirPath) {
  try {
    const filePath = path.join(dirPath, 'ABOUT.json');
    const data = await fs.readFile(filePath, 'utf8');
    return { 
      ...JSON.parse(data), 
      path: path.basename(dirPath)
    };
  } catch (error) {
    console.warn(`No ABOUT.json found in ${dirPath}`);
    return null;
  }
}

async function main() {
  try {
    const currentDir = process.cwd();
    const directories = await getDirectories(currentDir);
    
    const cards = (await Promise.all(
      directories.map(dir => readAboutFile(path.join(currentDir, dir)))
    )).filter(Boolean);

    await fs.writeFile(
      path.join(currentDir, 'cards.json'), 
      JSON.stringify(cards, null, 2)
    );
    
    console.log('Successfully generated cards.json');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
