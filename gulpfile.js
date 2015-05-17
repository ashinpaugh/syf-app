/**
 *
 */

"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    lint = require('gulp-jshint'),
    run  = require('gulp-sequence'),
    concat = require('gulp-concat'),
    cssMinify = require('gulp-minify-css')
;

/**
 * Check for dumb javascript.
 */
gulp.task('js-lint', function () {
    return gulp.src('resources/scripts/**/*.js')
        .pipe(lint())
        .pipe(lint.reporter('default'))
    ;
});

/**
 * Compile the less files.
 */
gulp.task('build-less', function () {
    return gulp.src('resources/less/*.less')
        .pipe(less())
        .pipe(cssMinify())
        .pipe(gulp.dest('www/css'))
    ;
});

/**
 * Concatenate the javascript files.
 */
gulp.task('build-js', function () {
    return run(
        'build-js-utilities',
        'build-js-bootstrap',
        'build-js-controllers'
    );
});

gulp.task('build-js-bootstrap', function () {
    return gulp.src([
            'resources/scripts/app-bootstrap.js',
            'resources/scripts/config/*.js'
        ])
        .pipe(concat('app-config.js'))
        .pipe(gulp.dest('www/scripts'))
    ;
});

gulp.task('build-js-core', function () {
    return gulp.src([
            'resources/scripts/app.js',
            'resources/scripts/CalorieCounter.js',
            'resources/scripts/StepDetector.js',
            'resources/scripts/Pedometer.js'
        ])
        .pipe(concat('utilities.js'))
        .pipe(gulp.dest('www/scripts'))
});

gulp.task('build-js-controllers', ['build-js-bootstrap', 'build-js-utilities'], function () {
    return gulp.src('resources/scripts/controller/*.js')
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('www/scripts'))
});

gulp.task('watch', function () {
    gulp.watch('www/less/*.less', ['build-less']);
    gulp.watch(['resources/scripts/*.js'], ['build-js']);
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