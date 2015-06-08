'use strict';

module.exports = function (grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverJS: ['Gruntfile.js', 'server.js', 'app/**/*.js', '!app/tests/'],
		clientViews: ['public/modules/**/views/**/*.html', 'public/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js', '!public/modules/appTemplates.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};


	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		auto_install: {
			local: {}
		},
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
					'public/dist/app.min.js' : watchFiles.clientJS.concat([ 'public/modules/appTemplates.js' ])
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
				tasks: ['jshint', 'ngtemplates'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				tasks: ['ngtemplates'],
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
		},
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['nodemon', 'watch']
		},
		ngtemplates: {
			app: {
				cwd: 'public',
				src: 'views/templates/**/*.html',
				dest: 'public/modules/appTemplates.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-auto-install');

	grunt.registerTask('default', [ 'auto_install', 'jshint', 'uglify', 'ngtemplates', 'concurrent' ]);

};
