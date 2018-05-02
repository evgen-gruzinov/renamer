const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const insert = require('gulp-insert');
const rename = require("gulp-rename");
const removeFiles = require('gulp-remove-files');

gulp.task('css', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./src'));
});

gulp.task('css:watch', function () {
    gulp.watch('./src/**/*.scss', ['css']);
});


gulp.task('set-prod', function() {
    gulp
        .src('./src/js/main.js')
        .pipe(rename("main_dev.js"))
        .pipe(gulp.dest('./src/js/'));

    gulp
        .src('./src/js/main.js')
        .pipe(insert.prepend('process.env.NODE_ENV = \'production\'; \r\n'))
        .pipe(gulp.dest('./src/js/'));
});

gulp.task('set-dev', function() {
    gulp
        .src('./src/js/main_dev.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./src/js/'));
    gulp
        .src('./src/js/main_dev.js')
        .pipe(removeFiles());
});