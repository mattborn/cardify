# Cardify

Generate project summary cards from a directory structure. Each subdirectory can contain an `ABOUT.json` file with project metadata.

## Tools

- `about.js`: Initialize empty ABOUT.json files in all subdirectories
- `cardify.js`: Generate cards.json by collecting data from all ABOUT.json files

## Usage

```bash
# Initialize ABOUT.json files in subdirectories
node about.js

# Generate cards.json from ABOUT.json files
node cardify.js
```
