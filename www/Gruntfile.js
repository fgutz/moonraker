
var path = require('path');

var allscripts = [
    'js/libs/modernizr.js',
    'js/libs/jquery-2.0.3.min.js',
    'js/libs/socket.io.js',
    'js/transitions.js',
    'js/index.js'
];

module.exports = function(grunt){
    "use strict";
    
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        config: {
          timestamp: parseInt(new Date().getTime() / 1000, 10)
        },

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            html: {
                files: ['index.html'],
                tasks: ['htmlhint']
            },
            js: {
                files: allscripts,
                tasks: ['uglify']
            }
        },

        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['index.html']
            }
        },

        uglify: {
          js: {
            src: allscripts,
            dest: 'build/moonraker.min.js',
            options: {
                beautify: false,
                compress: true,
                mangle: true,
                report: false,
                preseveComments: false
            }
          }
        },

        concat: {
            options: {
                stripBanners: true
            },
            js: {
                src: allscripts,
                dest: 'build/moonraker.min.js'
            }
        },
    });

    grunt.registerTask('default', []);

};