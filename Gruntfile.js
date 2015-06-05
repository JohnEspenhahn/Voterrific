'use strict';

module.exports = function (grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverJS: ['Gruntfile.js', 'server.js', 'app/**/*.js', '!app/tests/'],
		clientViews: ['public/modules/**/views/**/*.html', 'public/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};


	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jshint : {
			all: {
				src: watchFiles.serverJS.concat(watchFiles.clientJS),
				options: {
					jshintrc: true
				}
			}
		},
		uglify : {
			production : {
				files : {
					'public/dist/app.min.js' : watchFiles.clientJS
				}
			}
		},
		nodemon : {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverJS
				}
			}
		},
		watch : {
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			/*
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				options: {
					livereload: true
				}
			}
			*/
		},
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['nodemon', 'watch']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('default', ['jshint', 'uglify', 'concurrent' ]);

};
