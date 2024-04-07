// Skip Husky install in production and CI
if (process.env.NODE_ENV === 'production' || process.env.CI) {
  console.log('Husky skipped');
  process.exit(0);
}
