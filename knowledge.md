# Cardify Alpha

## Project Structure
- Each subdirectory can contain an `ABOUT.json` file
- The root directory contains `generate-cards.js` which generates a `cards.json` containing data from all ABOUT.json files
- Each card in cards.json includes the project's relative path
- All tools should operate recursively through directory structures
- Shared utilities should be extracted to global.js to avoid duplication

## ABOUT.json Format
```json
{
  "title": "Project Title",
  "description": "Project description",
  "image": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
}
```

## Usage
Run from parent directory:
```bash
node generate-cards.js
```
