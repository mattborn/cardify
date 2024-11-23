const fs = require('fs').promises;
const path = require('path');

async function getDirectories(source) {
  const items = await fs.readdir(source, { withFileTypes: true });
  return items
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

module.exports = { getDirectories };
