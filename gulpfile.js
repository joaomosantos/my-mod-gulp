var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

gulp.task('default', function() {});

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src('src/css/less/*.less')
  .pipe(less())
  .pipe(gulp.dest('src/css'));
});

/* Sincronizar Less ao browser*/
gulp.task('sync-less', ['compiler-less', 'watch']);
gulp.task('less-watch', ['compiler-less'], browserSync.reload);
gulp.watch("src/*.html").on("change", browserSync.reload);
gulp.task('watch', function() {
  browserSync({
    server: {
      baseDir: 'src/'
    }
  });
  gulp.watch('src/css/less/*.less' , ['less-watch']);
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
