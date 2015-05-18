/**
 * Gulp file.
 * 
 * Used to concatenate most files, to minimize loading times,
 * and used to watch files and automate cordova / ripple emulation flow.
 * 
 * Usage:
 *  $ gulp
 *  $ ripple emulate
 */

"use strict";

var gulp = require('gulp'),
    less = require('gulp-less'),
    lint = require('gulp-jshint'),
    run  = require('gulp-sequence'),
    copy = require('gulp-copy'),
    sh   = require('child_process'),
    concat = require('gulp-concat'),
    cssMinify = require('gulp-minify-css')
;

/**
 * Check for dumb javascript.
 */
gulp.task('js-lint', function () {
    return gulp.src([
            'resources/scripts/**/*.js',
            '!resources/scripts/lib/**/*.js'
        ])
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
 * Concatenate the CSS libraries.
 */
gulp.task('build-css-libs', function () {
    gulp.src(['resources/css/boot*.min.css'])
        .pipe(concat('bootstrap.min.css', {newLine: "\n\n"}))
        .pipe(gulp.dest('www/css'))
    ;
    
    gulp.src(['resources/css/jquery*.min.css'])
        .pipe(concat('jquery.min.css', {newLine: "\n\n"}))
        .pipe(gulp.dest('www/css'))
    ;
    
    gulp.src('./resources/css/font-awesome.min.css')
        .pipe(copy('www/css/.', {prefix: 3}))
    ;
});

/**
 * Bundle the JS libraries together.
 */
gulp.task('build-js-libs', function () {
    gulp.src([
            'resources/scripts/lib/jquery/jquery.min.js',
            'resources/scripts/lib/jquery/*.min.js'
        ])
        .pipe(concat('jquery.min.js', {newLine: "\n\n"}))
        .pipe(gulp.dest('www/scripts/lib'))
    ;
    
    gulp.src([
            'resources/scripts/lib/angular/angular.min.js',
            'resources/scripts/lib/angular/*.min.js'
        ])
        .pipe(concat('angular.min.js', {newLine: "\n\n"}))
        .pipe(gulp.dest('www/scripts/lib'))
    ;
    
    gulp.src([
            'resources/scripts/lib/bootstrap/bootstrap.min.js',
            'resources/scripts/lib/bootstrap/*.min.js'
        ])
        .pipe(concat('bootstrap.min.js', {newLine: "\n\n"}))
        .pipe(gulp.dest('www/scripts/lib'))
    ;
});

/**
 * Concatenate the javascript files.
 */
gulp.task('build-js', function () {
    gulp.src([
        'resources/scripts/app-bootstrap.js',
        'resources/scripts/config/app-modules.js',
        'resources/scripts/config/*.js'
    ]).pipe(concat('app-config.js'))
      .pipe(gulp.dest('www/scripts'))
    ;
    
    gulp.src([
        'resources/scripts/app.js',
        'resources/scripts/CalorieCounter.js',
        'resources/scripts/StepDetector.js',
        'resources/scripts/Pedometer.js'
    ]).pipe(concat('utilities.js'))
      .pipe(gulp.dest('www/scripts'))
    ;
    
    gulp.src('resources/scripts/controller/*.js')
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest('www/scripts'))
    ;
});

/**
 * Issue cordova prepare command.
 */
gulp.task('cordova-prepare', function (cb) {
    return sh.exec('cordova prepare', function (err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }
        
        if (stderr) {
            console.log(stderr);
        }
        
        cb(err);
    });
});

/**
 * Watch for changes in the Less and JS files and issue cordova prepare as necessary.
 */
gulp.task('watch', function () {
    gulp.watch(__dirname + '/resources/less/*.less', ['build-less']);
    gulp.watch(__dirname + '/resources/scripts/**/*.js', ['build-js']);
    
    gulp.watch([
        __dirname + '/www/**/*.js',
        __dirname + '/www/**/*.css',
        __dirname + '/www/**/*.html'
    ], ['cordova-prepare']);
});

/**
 * This task is automatically executed.
 */
gulp.task('default', function () {
    return run('build-less', 'build-css-libs', 'build-js-libs', 'js-lint', 'build-js', 'cordova-prepare', 'watch', function () {
        
    });
});