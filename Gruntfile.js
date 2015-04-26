module.exports = function(grunt) {
		
	grunt.initConfig({

		bower_concat: {
			all: {
				dest: 'src/js/_bower.js',
				cssDest: 'public/css/_bower.less',
				exclude: [],
				dependencies: {
					'bootstrap': 'jquery'
				},
				bowerOptions: {
					relative: false
				}
			}
		},

	    bower_copy: {
	        options: {
	            clean: false
	        },
	    	fonts: {
		        options: {},
	            files: {
	                'bower_components/bootstrap/fonts': 'public/fonts',
	                'bower_components/font-awesome/fonts': 'public/fonts'
	            }
	    	},
	    	maps: {
		        options: {},
	            files: {
	                'bower_components/bootstrap/dist/css/bootstrap.css.map': 'public/bootstrap.css.map'
	            }
	    	}
	    },

		concat: {
				js: {
					src: [
						'src/js/_bower.js',
						'src/js/dashboard.js'
					],
					dest: 'public/hobobot.js'
				}
		},


        less: {
            project: {
                options: {
                    paths: ['src/less'],
                    yuicompress: true
                },
                src: ['src/less/hobobot.less'],               
                dest: 'public/hobobot.css'
            }
        },

		watch: {
			js: {
				files: ['src/js/*.js'],
				tasks: 'js'
			},
			css: {
				files: ['src/less/*.less'],
				tasks: 'css'
			}
		}

	});

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');

	grunt.registerTask('js', ['bower_concat','concat:js']);
	grunt.registerTask('css', ['less']);
	grunt.registerTask('bower_copy', ['bower_copy']);

	grunt.registerTask('default', ['js','css','bower_copy']);

};