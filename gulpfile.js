var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

/* Compilar LESS */
gulp.task('less', function() {
  gulp.src('css/less/*.less')
  .pipe(less())
  .pipe(gulp.dest('css'));
});

/* Concatenar todos os LESS em um único CSS */
gulp.task('concat-css', ['less'], function() {
  gulp.src('css/*.css')
  .pipe(concat('all.css'))
  .pipe(gulp.dest('css'));
});

/* Gerar CSS minificado */
gulp.task('minify-css', ['concat-css'], function() {
  gulp.src('css/all.css')
  .pipe(minifyCSS())
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest('css'));
});


gulp.task('watch', function() {
  gulp.watch('css/less/*.less' , ['less', 'concat-css', 'minify-css']);
});

gulp.task('default', ['less', 'concat-css', 'minify-css', 'watch']);
