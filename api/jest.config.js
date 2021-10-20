// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
  };
  
  module.exports = config;
  
  // Or async function
  module.exports = async () => {
    return {
      verbose: true,
      moduleFileExtensions: [...defaults.moduleFileExtensions, 'js'],
      testEnvironment: 'node',
      preset: '@shelf/jest-mongodb'
    };
  };