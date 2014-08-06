var chalk         = require('chalk');
var child_process = require('child_process');
var async         = require('async');
var fs            = require('fs');
var path          = require('path');
var pidFile       = process.env.HOME + '/.grunt-webdriver/selenium.pid';

module.exports = function (grunt) {

    function webdriverUpdate(cb) {

        // spawn a child process
        var spawn = child_process.spawn(
            "./node_modules/.bin/webdriver-manager",
            ['update'],
            {
                cwd: process.cwd()
            }
        );

        spawn.stdout.pipe(process.stdout);
        spawn.stderr.pipe(process.stderr);

        if (cb) {
            spawn.on('exit', cb);
        }

    }

    // catch any events that trigger the stop webdriver
    process.on('stopWebdriver', function (cb, remove) {
        if (remove) {
            process.removeListener('exit', webdriverStopSync);
        }
        webdriverStopSync();
        if (cb) cb();
    });


    function webdriverStopSync(cb) {

        var exists = fs.existsSync(pidFile);

        if (exists) {
            var data = fs.readFileSync(pidFile, {encoding: "utf8"});

            // attempt to kill the process
            grunt.log.write(chalk.red('Stopping'), 'Selenium process: ' + data + '\n');
            try {
                process.kill(parseInt(data));
            } catch (e) {
                grunt.log.write('Process no longer exists.\n');
            }

            // clean up the file
            fs.unlinkSync(pidFile);

        }

        // remove the listener on exit
        process.removeListener('exit', webdriverStopSync);

    }


    grunt.registerMultiTask('webdriver', '', function () {

        var done = this.async();

        var options = this.options();

        async.series([

            // if we're calling the stop target, clean up and bail out
            function (cb) {
                if (this.target === 'stop') {
                    webdriverStopSync();
                    process.exit(0);
                } else
                if (this.target === 'update') {
                    webdriverUpdate(function () {
                        process.exit(0);
                    });
                } else {
                    cb(null);
                }
            }.bind(this),

            // run the cleanup function incase there is a selenium process running
            function (cb) {
                fs.exists(pidFile, function (exists) {
                    if (exists) {
                        webdriverStopSync();
                        return cb(null);
                    } else {
                        return cb(null);
                    }
                });
            },

            // make sure the dir for the pidfile exists
            function (cb) {
                var dirname = path.dirname(pidFile);
                fs.exists(dirname, function (exists) {
                    if (!exists) {
                        fs.mkdir(dirname, 0777, function (err) {
                            if (err) return cb(err);
                            grunt.log.write('Created "' + dirname + '"\n');
                            return cb(null);
                        });
                    } else {
                        return cb(null);
                    }
                });
            },

            // start the server
            function (cb) {

                // spawn a child process
                var spawn = child_process.spawn(
                    "./node_modules/.bin/webdriver-manager",
                    ['start'],
                    {
                        cwd: process.cwd()
                    }
                );

                // for a verbose output of what the selenium server is doing,
                // pipe the stdout of this spawned process to the main process
                // spawn.stdout.pipe(process.stdout);
                spawn.stderr.pipe(process.stderr);

                spawn.stdout.setEncoding('utf8');
                spawn.stdout.on('data', function (data) {

                    var matchPid = data.match(/seleniumProcess\.pid:\s+(\d+)/);
                    if (matchPid) {
                        // write the pidfile
                        fs.writeFile(pidFile, matchPid[1], {encoding: 'utf8'}, function (err) {
                            if (err) return cb(err);
                        });
                    }

                    var matchStart = data.match(/Started\sSocketListener\son\s\d+\.\d+\.\d+\.\d+:\d+/);
                    if (matchStart) {
                        // we've started, let's end the task
                        grunt.log.write('Selenium webdriver started.\n');
                        return cb(null);
                    }

                    var matchError = data.match(/Selenium\sStandalone\shas\sexited/);
                    if (matchError) {
                        throw new Error(data);
                    }

                });

                // spawn.stderr.on('data', function (data) {
                //     grunt.log.error(data + '\n');
                // });

                spawn.on('error', function (err) {
                    return cb(err);
                });


            }

        ], function (err, result) {

            if (err) throw err;

            if (options.background) {
                grunt.log.write(chalk.green('Backgrounding selenium server.\n'));
                done();
            } else {
                // register the on exit event if we aren't detaching to run in the background
                process.on('exit', webdriverStopSync);
            }

        });

    });

    return {
        options: {
            background: false
        },
        all: {
        },
        bg: {
            options: {
                background: true
            }
        },
        // needs to be here for the "stop" target condition
        stop: {},
        // needs to be here for the "update" target condition
        update: {}
    };

};
