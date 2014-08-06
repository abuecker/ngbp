var config = require('./protractor-shared-conf').config;

config.capabilities = {
  browserName: 'firefox',
  // shardTestFiles: true,
  // maxInstances: 2,
};

exports.config = config;
