/**
 * Created by Josh Crowe on 04/05/2017.
 */
const gulp = require('gulp');
const gulpSQL = require('gulp-sqlite3');
const gulpLESS = require('gulp-less');
var gulpHandlebars = require('gulp-handlebars');
var gulpWrap = require('gulp-wrap');
var gulpDeclare = require('gulp-declare');
var gulpConcat = require('gulp-concat');

// Initialise Database
gulp.task('databaseSetup', () => {
    "use strict";
    return gulp.src('/src/database/*.sql')
        .pipe(gulpSQL('/dist/queue.db'));
});

// Compile Less
gulp.task('lessCompilation', () => {
    "use strict";

    return gulp.src('/src/public/styles/*.less')
        .pipe(gulpLESS())
        .pipe(gulp.dest('/dist/public/styles/styles.css'));
});

// Compile Handlebars
gulp.task('handlebarsCompilation', () => {
    "use strict";

    return gulp.src('/src/files/templates/*.hbs')
        .pipe(gulpHandlebars())
        .pipe(gulpWrap('Handlebars.template(<%= contents %>'))
        .pipe(gulpDeclare({
            namespace: 'queue.templates',
            noRedeclare: true
        }))
        .pipe(gulpConcat('templates.js'))
        .pipe(gulp.dest('/dist/public/scripts'));
})