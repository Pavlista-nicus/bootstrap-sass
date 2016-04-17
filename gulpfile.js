/* jshint node: true */
'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  // reporter pro js do terminalu
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  connect = require('gulp-connect');


var buildConfig = require('./build_config.json');
var paths = buildConfig.paths;

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function() {
  return gulp.src(paths.mainStyle)
    //build_config.json - konfigurace sass
    .pipe(sass(buildConfig.sass).on('error', sass.logError))
    .pipe(gulp.dest(paths.dest));
});

//pages
gulp.task('usemin', function() {
  return gulp.src(paths.pages)
    .pipe(usemin(buildConfig.usemin))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    //sklada mi z vice slozek do jedne
    .pipe(rename({
      dirname: "/"
    }))
    .pipe(gulp.dest(paths.dest + "/fonts"));

});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.dest + "/fonts"));


});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('connect', function() {
    connect.server(buildConfig.connect);
});

gulp.task('livereload', function() {
  gulp.src(paths.dest+"/**/*")
   .pipe(connect.reload());
});


gulp.task('watch', function() {
  //parametr 2 array - 1. sleduje, 2. pouští
  gulp.watch([paths.scripts], ["jshint", "scripts"]);
  gulp.watch([paths.images], ["images"]);
  gulp.watch([paths.styles], ["styles"]);
  gulp.watch([paths.fonts], ["fonts"]);
  gulp.watch([paths.pages], ["usemin"]);
  gulp.watch([paths.dest + "/**/*"], ["livereload"]);
});

gulp.task('default', ["jshint", "scripts", "images", "styles", "fonts", "usemin", "connect", "watch"]);
