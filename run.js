const { execSync } = require('child_process')

function generateCards() {
  console.log('\n📇 Generating cards...')

  try {
    // Initialize ABOUT.json files where missing
    execSync('node cardify/about', { stdio: 'inherit' })

    // Generate cards.json from ABOUT files
    execSync('node cardify/cardify', { stdio: 'inherit' })

    console.log('\n✨ Cards generated successfully!')
  } catch (error) {
    console.error('❌ Error generating cards:', error.message)
    process.exit(1)
  }
}

generateCards()
