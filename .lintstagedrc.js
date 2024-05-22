const path = require('path')

const typescriptCheckingCommand = () => {
  const ignoreTrigger = process.env.HUSKY_LINT_STAGED_IGNORE?.toString()
  return ignoreTrigger === '0' ? 'echo "type-check is disabled"' : `npm run type-check`
}

const buildEslintCommand = () => {
  const ignoreTrigger = process.env.HUSKY_LINT_STAGED_IGNORE?.toString()
  return ignoreTrigger === '0' ? 'echo "eslint is disabled"' : `npm run lint:fix`
}

const buildPrettierCommand = (filenames) => {
  const prettierConfig = path.join(__dirname, '.prettierrc')
  const ignoreTrigger = process.env.HUSKY_LINT_STAGED_IGNORE?.toString()
  return ignoreTrigger === '0'
    ? 'echo "prettier is disabled"'
    : `npx prettier --config ${prettierConfig} --write ${filenames.join(' ')}`
}

module.exports = {
  '*.{js,jsx,ts,tsx}': [typescriptCheckingCommand, buildEslintCommand, buildPrettierCommand],
}
