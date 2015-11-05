var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src('src/css/less/*.less')
  .pipe(less())
  .pipe(gulp.dest('src/css'));
});

/* Concatenar todos os LESS em um único CSS */
gulp.task('concat-css', ['compiler-less'], function() {
  gulp.src('src/css/*.css')
  .pipe(concat('all.css'))
  .pipe(gulp.dest('src/css/final'));
});

/* Gerar CSS minificado */
gulp.task('minify-css', ['concat-css'], function() {
  gulp.src('src/css/final/all.css')
  .pipe(minifyCSS())
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest('src/css/final'));
});


gulp.task('watch', function() {
  gulp.watch('src/css/less/*.less' , ['compiler-less']);
});

gulp.task('default', ['compiler-less', 'watch']);
