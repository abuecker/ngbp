var config = require('./protractor-shared-conf').config;

config.chromeOnly = true;

config.capabilities = {
  browserName: 'chrome',
  // shardTestFiles: true,
  // maxInstances: 2
};


exports.config = config;

// vim: set ts=2 sw=2 expandtab:
