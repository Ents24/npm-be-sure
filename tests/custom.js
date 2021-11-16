const beSureCustom = require('../index.js')

// Add a new validator
const catCheck = value => typeof value === 'object' && value.says === 'meow'
beSureCustom.setValidator('cat', catCheck)

// Redefine 'int' validator
const maxSafeIntegerCheck = value => {
  if (typeof value !== 'number' || value !== parseInt(value, 10)) {
    return false
  }

  if (value > Number.MAX_SAFE_INTEGER) {
    return false
  }

  return true
}

beSureCustom.setValidator('int', maxSafeIntegerCheck)

module.exports = beSureCustom;
