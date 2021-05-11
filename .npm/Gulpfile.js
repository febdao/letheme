/*jslint indent: 2 */
'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  clean = require('gulp-clean'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  exec = require('child_process').exec,
  src = {
    scss: '../scss/**/*.scss',
    css: '../css',
    twigFile: '../pattern-lab/source/_**/**/*.twig',
    jsonFile: '../pattern-lab/source/_**/**/*.json',
    mdFile: '../pattern-lab/source/_**/**/*.md',
    javascript: '../js/*.js',
    cssFile: '../css/*.css',
    htmlFile: '../pattern-lab/public/styleguide/html/*.html',
  };

gulp.task('clean', function () {
  return gulp.src('../css/styles.css', {
      read: false,
      allowEmpty: true
    })
    .pipe(clean({force: true}));
});

gulp.task('styles', gulp.parallel('clean', function(){
  return gulp.src('../scss/{,*/}*.{scss,sass}', {
      allowEmpty: true
    })
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(src.css));
}));

gulp.task('watch', gulp.parallel('styles', function(){
  gulp.watch(src.scss, gulp.series(['styles']));
}));

gulp.task('sg-build', async function(){
  exec('cd ../pattern-lab/ && npm install && npm run build');
});

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: "../",
    },
    files: [
      src.cssFile,
      src.javascript
    ]
  })
});

// Task for local, static development.
gulp.task('sg-server', gulp.parallel('browser-sync', 'styles', 'sg-build', function (done) {

  gulp.watch(src.scss, gulp.series(['styles']));
  gulp.watch(src.javascript).on('change', reload);
  gulp.watch(src.cssFile).on('change', reload);
  gulp.watch(src.htmlFile).on('change', reload);
  gulp.watch(src.twigFile, gulp.series(['sg-build']));
  gulp.watch(src.jsonFile, gulp.series(['sg-build']));
  gulp.watch(src.mdFile, gulp.series(['sg-build']));
  done();
}));

gulp.task('default', gulp.parallel('styles'));
