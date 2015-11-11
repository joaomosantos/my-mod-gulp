var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var ssi = require('browsersync-ssi');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

gulp.task('default', function() {});

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src('css/less/*.less')
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.stream());
});

/* Compilar SASS */
gulp.task('compiler-sass', function() {
  gulp.src('css/sass/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.stream());
});

/* Sincronizar browser*/
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './',
      index: 'index',
      /*middleware: ssi({
        baseDir: __dirname
      })*/
    }
  });
  gulp.watch('css/less/*.less', ['compiler-less'], browserSync.reload);
  gulp.watch('css/sass/*.scss', ['compiler-sass'], browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('*.shtml', browserSync.reload);
});

/* Concatenar em um único CSS */
gulp.task('concat-css', function() {
  gulp.src('css/*.css')
  .pipe(concat('all.css'))
  .pipe(gulp.dest('css/final'));
});

/* Gerar CSS minificado */
gulp.task('minify-css', ['concat-css'], function() {
  gulp.src('css/final/all.css')
  .pipe(minifyCSS())
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest('css/final'));
});

// Adicionar auto prefixo
gulp.task('autoprefixer-css', function() {
  gulp.src('css/*.css')
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('css'));
});
