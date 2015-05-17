/**
 *
 */

"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    lint = require('gulp-jshint'),
    run  = require('run-sequence'),
    concat = require('gulp-concat'),
    cssMinify = require('gulp-minify-css')
;

/**
 * Check for stupid javascript.
 */
gulp.task('js-lint', function () {
    return gulp.src([
            'www/js/**/*.js',
            '!www/js/lib/*'
        ])
        .pipe(lint())
        .pipe(lint.reporter('default'))
    ;
});

/**
 * Compile the less files.
 */
gulp.task('build-less', function () {
    return gulp.src('www/less/*.less')
        .pipe(less())
        .pipe(cssMinify())
        .pipe(gulp.dest('www/css'))
    ;
});

/**
 * Concatenate the javascript files.
 */
gulp.task('build-js', function () {
    gulp.src(['www/js/app.js', 'www/js/core.js'])
        .pipe(concat('core.js'))
        .pipe(gulp.dest('www/js'))
    ;
    
    return run('build-js-pedometer-utility', 'build-js-controllers');
});

gulp.task('build-js-pedometer-utility', ['build-js'], function () {
    return gulp.src([
            'www/js/CalorieCounter.js',
            'www/js/StepDetector.js',
            'www/js/Pedometer.js'
        ])
        .pipe(concat('PedometerUtilities.js'))
        .pipe(gulp.dest('www/js'))
});

gulp.task('build-js-controllers', ['build-js', 'build-js-pedometer-utility'], function () {
    return gulp.src('www/js/controller/*.js')
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('www/js'))
});

gulp.task('watch', function () {
    gulp.watch('www/less/*.less', ['build-less']);
    gulp.watch(['www/js/*.js', '!www/js/lib/*'], ['build-js']);
});

/*gulp.watch('www/less/*.less', function (event) {
    if ('changed' != event.type) {
        return;
    }
    
    run('build-less');
});*/

gulp.task('default', ['js-lint', 'build-js', 'build-less', 'watch'], function (e) {
    console.log('default task:');
    console.log(e);
});