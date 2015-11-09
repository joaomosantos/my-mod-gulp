var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function() {});

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src('src/css/less/*.less')
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.stream());
});

/* Sincronizar Less ao browser*/
gulp.task('servidor-less', function() {
  browserSync({
    server: {
      baseDir: 'src/'
    }
  });
  gulp.watch('src/css/less/*.less', ['compiler-less'], browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
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
