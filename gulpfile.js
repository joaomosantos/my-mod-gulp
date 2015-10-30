var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('default', ['less', 'watch-less']);

/* Compilar Less */
gulp.task('less', function() {
  gulp.src('less/*.less')
  .pipe(less())
  .pipe(gulp.dest('css'));
});

/* Gerar CSS minificado */
gulp.task('minify', function() {
  gulp.src('less/*.less')
  .pipe(less())
  .pipe(minifyCSS())
  .pipe(rename(function (path){
    path.basename += ".min"
  }))
  .pipe(gulp.dest('css'));
});

/* Concatenar todos os Less em um unico CSS */
gulp.task('concat', function() {
  gulp.src('less/*.less')
  .pipe(less())
  .pipe(concat('main.css'))
  .pipe(gulp.dest('css'));
});

gulp.task('watch-less', function() {
  gulp.watch('less/*.less' , ['less']);
});
