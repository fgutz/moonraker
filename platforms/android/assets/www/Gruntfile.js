
var libscripts = [
'js/libs/modernizr.js',
'js/libs/jquery-2.0.3.min.js',
'js/libs/socket.io.js'
];

var myscripts = [
'js/skyfall.js',
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
        files: [libscripts, myscripts],
        tasks: ['jshint','concat','uglify']
      },

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

    jshint: {
      options: {
        boss: true,
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        node: true,
        sub: true,
        trailing: true,
        undef: true,
        globals: {
          Modernizr: true,
          $: true,
          jQuery: true,
          io: true,
          PageTransitions: true,
          Skyfall: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: myscripts
      }
    },

    concat: {
      build: {
        files: {
          'js/moonraker.js': [libscripts, myscripts]
        }
      }
    },

    uglify: {
      build: {
        files: {
          'js/moonraker.min.js': ['js/moonraker.js']
        },
        options: {
          beautify: false,
          compress: true,
          mangle: true,
          report: false,
          preseveComments: false
        }
      }
    },

    exec:{
      prepare:{
        command:"phonegap build android",
        stdout:true,
        stderror:true
      },
      ripple: {
        command:"ripple emulate --path ../platforms/android/assets/www",
        stdout:true,
        stderror:true
      }
    },
  });

grunt.registerTask('default', ['htmlhint','jshint','concat','uglify']);

};