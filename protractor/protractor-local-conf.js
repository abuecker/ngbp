var config = require('./protractor-shared-conf').config;

config.multiCapabilities = [{
  browserName: 'chrome',
}, {
  browserName: 'firefox',
}, {
  browserName: 'safari',
}];

exports.config = config;
