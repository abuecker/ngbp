var spawn   = require('child_process').spawn;
var async   = require('async');
var traceur = require('traceur');
var fs      = require('fs-extra');
var path    = require('path');

module.exports = function (grunt, options) {

    grunt.registerMultiTask('traceur', 'ES6 Now!', function () {


        var optsIn = this.options();
        var opts = {
            sourceMaps: optsIn.sourceMaps || true,
            modules: optsIn.modules || 'register',
        };

        var done = this.async();

        async.each(this.files, function (file, cb) {

            /**
             * Read the source file
             */
            fs.readFile(
                file.src[0],
                {encoding: 'utf8'},
                function (err, data) {

                    if (err) return cb(err);

                    /**
                     * Run source through traceur compiler
                     */

                    // get the relative path as the moduleName option
                    opts.moduleName = path.relative(file.dest, file.src[0]);

                    var compiler = new traceur.NodeCompiler(opts);

                    var compiled = compiler.compile(data);
                    var sourceMap = compiler.getSourceMap();

                    /**
                     * Write the compiled output
                     */
                    async.parallel([

                        // write the compiled js
                        function (cb) {

                            // make sure the directory exists
                            var dir = path.dirname(file.dest);
                            if (!fs.existsSync(dir)) {
                                fs.mkdirpSync(dir);
                            }

                            fs.writeFile(
                                file.dest,
                                compiled,
                                {encoding: 'utf8'},
                                function (err) {
                                    if (err) return cb(err);
                                    grunt.log.writelns('Converted: ' + file.src[0] + ' -> ' + file.dest);
                                    return cb(null);
                                }
                            );
                        },

                        // write the source map
                        function (cb) {

                            if (!opts.sourceMaps) {
                                return cb(null);
                            }

                            var dir = path.dirname(file.dest);
                            if (!fs.existsSync(dir)) {
                                fs.mkdirpSync(dir);
                            }

                            fs.writeFile(
                                file.dest + '.map',
                                sourceMap,
                                {encoding: 'utf8'},
                                function (err) {
                                    if (err) return cb(err);
                                    grunt.log.writelns('Added map: ' + file.dest + '.map');
                                    return cb(null);
                                }
                            );
                        },
                    ], function (err, result) {
                        if (err) return cb(err);
                        cb(null);
                    });

                }
            );


        }, function (err) {
            if (err) {
                grunt.log.errorlns('ERROR: ' + err);
            }
            done();
        });

    });

    return {
        options: {
        },
        build: {
            options: {
                modules: 'inline',
                sourceMaps: true,
            },
            files: [{
                src: [
                    '**/*.js',
                    '!**/*.spec.js',
                    '!**/*.e2e.js'
                ],
                expand: true,
                cwd: 'src/',
                dest: '<%= build_dir %>/src',
            }]
        }
    };
};
