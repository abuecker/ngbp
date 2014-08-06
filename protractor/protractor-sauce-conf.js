var config = require('./protractor-shared-conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities = [{
  'browserName': 'chrome',
  'name': 'Analytics E2E',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  'build': process.env.TRAVIS_BUILD_NUMBER,
  "video-upload-on-pass": false,
// }, {
//   'browserName': 'firefox',
//   'name': 'Analytics E2E',
//   'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
//   'build': process.env.TRAVIS_BUILD_NUMBER,
//   'version': '28',
//   "video-upload-on-pass": false,
// }, {
//   browserName: 'safari',
//   'platform': 'OS X 10.9',
//   'version': '7',
//   'name': 'Analytics E2E',
//   'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
//   'build': process.env.TRAVIS_BUILD_NUMBER,
//   "video-upload-on-pass": false,
// }, {
//   browserName: 'internet explorer',
//   'platform': 'Windows 8',
//   'version': '10',
//   'name': 'Analytics E2E',
//   'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
//   'build': process.env.TRAVIS_BUILD_NUMBER,
//   "video-upload-on-pass": false,
}];

exports.config = config;
