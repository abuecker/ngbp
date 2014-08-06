var config = require('./protractor-shared-conf').config;

config.capabilities = {
  browserName: 'phantomjs',
  // shardTestFiles: true,
  // maxInstances: 2,
};

exports.config = config;
