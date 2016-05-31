"use strict";
var 
gulp = require('gulp'),
connect = require('gulp-connect'), // runs a local dev server
open = require('gulp-open'), // open a URL in web browser
// browserify = require('browserify'), // bundles JS
// source = require('vinyl-source-stream'), // Use conventianal text streams with Gulp

config = {
	port: 1109,
	devBaseUrl: 'http://localhost',
	paths: {
		dist: '../www'
	}
};

// Start a local dev server
gulp.task('connect', function () {
	connect.server({
		root: [config.paths.dist],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function () {
	gulp.src('../www/index.html')
		.pipe(open({ 
			uri: config.devBaseUrl + ':' + config.port + '/'
		}));
});

gulp.task('default', ['open']);