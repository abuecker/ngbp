var path          = require('path');
var chalk         = require('chalk');
var child_process = require('child_process');

module.exports = function (grunt, options) {

    grunt.registerMultiTask('protractor', 'Run the protractor tests', function () {

        var protractorMainPath    = require.resolve('protractor');
        var protractorBinPath     = path.resolve(protractorMainPath, '../../bin/protractor');
        var protractorRefConfPath = path.resolve(protractorMainPath, '../../referenceConf.js');

        var options    = this.options();
        var configFile = options.configFile || protractorRefConfPath;
        var onErrorCb  = options.onError || null;
        var app_files  = grunt.config('app_files');
        var specs      = app_files.e2e.join(',');

        // get the async callback
        var done = this.async();

        // spawn a child process
        var spawn = child_process.spawn(
            protractorBinPath,
            [
                configFile,
                '--specs', specs
            ],
            {
                cwd: process.cwd()
            }
        );

        // pipe the output of protractor to the current process
        spawn.stdout.pipe(process.stdout);
        spawn.stderr.pipe(process.stderr);

        // check if we exit the child process nicely
        spawn.on('exit', function (code) {
            if (code) {
                grunt.log.error(chalk.red('Error running protractor task.  Cleaning up.'));
                // trigger the stop webdriver event
                process.emit('stopWebdriver', function () {
                    process.exit(code);
                }, true);
            } else {
                done();
            }
        });

    });

    return {
        options: {
        },
        phantom: {
            options: {
                configFile: "protractor/protractor-phantom-conf.js",
            },
        },
        local: {
            options: {
                configFile: "protractor/protractor-local-conf.js",
            },
        },
        sauce: {
            options: {
                configFile: "protractor/protractor-sauce-conf.js",
            },
        },
        chrome: {
            options: {
                configFile: "protractor/protractor-chrome-conf.js",
            },
        },
        firefox: {
            options: {
                configFile: "protractor/protractor-firefox-conf.js",
            },
        },
    };

};
