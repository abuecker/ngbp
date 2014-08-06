/**
 * vim: set expandtab ts=2 sw=2:
 */
var path = require('path');

module.exports = function ( grunt ) {

  /**
   * Get the information from the build file
   */
  var userConfig = require('./build.config.js');

  /**
   * Report the time usage for each grunt task
   *
   */
  require('time-grunt')(grunt);

  /**
   * This allows us to break Grunt up into small maintanble files in the
   * `grunt` directory.
   */
  require('load-grunt-config')(grunt, {

    /**
     * The directory with all the grunt tasks
     *
     */
    configPath: path.join(process.cwd(), 'grunt'),


    /**
     * Automatically run grunt.initConfig
     */
    init: true,

    /**
     * Optional data to merge in with task configs
     *
     */
    data: userConfig,

    /**
     * Optionally load all grunt tasks automatically
     */
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    }

  });

};
