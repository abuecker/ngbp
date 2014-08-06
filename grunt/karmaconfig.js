/**
* In order to avoid having to specify manually the files needed for karma to
* run, we use grunt to manage the list for us. The `karma/*` files are
* compiled as grunt templates for use by Karma. Yay!
*/

module.exports = function (grunt, options) {

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

  return {

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    unit: {
      dir: '<%= build_dir %>',
      src: [
        '<%= vendor_files.js %>',
        '<%= html2js.app.dest %>',
        '<%= html2js.common.dest %>',
        '<%= test_files.js %>',
        '<%= app_files.js %>',
        '<%= app_files.jsunit %>',
      ]
    }
  };

};
