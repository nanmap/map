module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			},
			build: {
				src: ['lib/MuleGIS/MuleGIS.js','lib/MuleGIS/**/*.js'],
				dest: 'lib/<%= pkg.name %>.min.js'
			},
		},
		concat: {
			debug: {
				src: ['<%= uglify.build.src %>'],
				dest: 'lib/<%= pkg.name %>.debug.js'
			}
		},
		jshint: {
			files: ['<%= uglify.build.src %>'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		jsdoc: {
			src: ['<%= uglify.build.src %>'],
			destination: 'doc',
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint','concat','uglify']
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['jshint','concat','uglify']);
};
