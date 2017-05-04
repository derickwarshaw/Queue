/**
 * Created by Josh Crowe on 04/05/2017.
 */
const gulp = require('gulp');
const gulpLESS = require('gulp-less');
const gulpConcat = require('gulp-concat');

gulp.task('default', ['lessCompilation']);

gulp.task('lessCompilation', () => {
    "use strict";

    return gulp.src('./src/public/styles/*.less')
        .pipe(gulpLESS())
        .pipe(gulpConcat('styles.css'))
        .pipe(gulp.dest('./dist/public/'));
});
