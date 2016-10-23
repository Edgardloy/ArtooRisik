var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('default', function () {
	server.run(['server/server.js'], {}, 7777);

	gulp.watch(['client/**/*.html'], server.notify);
	gulp.watch(['client/**/*.js'], server.notify);
	gulp.watch(['server/**/*.js'], [server.run]);
});