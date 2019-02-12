const gulp = require('gulp');
const wiredep = require('wiredep').stream;
const browserSync = require('browser-sync')
const ssi = require('browsersync-ssi');
const $less = require('gulp-less');
const $sass = require('gulp-sass');
const $autoprefixer = require('gulp-autoprefixer');
const $rename = require('gulp-rename');
const $cleancss = require('gulp-clean-css');
const $uglify = require('gulp-uglify');
const $sourcemaps = require('gulp-sourcemaps');
const $imagemin = require('gulp-imagemin');
const $if = require('gulp-if');
const $useref = require('gulp-useref');
const $minifyJSON = require('gulp-json-fmt');

const configs = {
  sync: {
    ext: [
    './app/*.{html,htm,shtm,shtml}',
    './app/inc/**/*.{html,htm,shtm,shtml}',
    './app/css/**/*.css',
    './app/js/**/*.js',
    './app/template/*.mst',
    ]
  },
  html: {
    main: './app/*.{html,htm,shtm,shtml}',
    dest: './app/'
  },
  less: {
    source: './app/css/less/*.less',
    main: './app/css/less/main.less',
    dest: './app/css/'
  },
  sass: {
    source: './app/css/sass/*.{scss,sass}',
    main: './app/css/sass/main.{scss,sass}',
    dest: './app/css/'
  },
  img: {
    source: './app/images/**/*',
    dest: './app/images/dist'
  },
  json: {
    source: './app/json/*.json',
    dest: './app/json/dist'
  },
  build: {
    source: [
    './app/inc/**/*.{html,htm,shtm,shtml}',
    './app/favicon.ico',
    './app/pdf/*.pdf',
    './app/template/*.mst',
    './app/css/sass/*.scss',
    './app/css/less/*.less',
    './app/css/fonts/**/*'
    ],
    dest: './app'
  },
};

function less() {
  return gulp
    .src(configs.less.main)
    .pipe($less())
    .pipe($autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(configs.less.dest))
};

function sass() {
  return gulp
    .src(configs.sass.main)
    .pipe($sass({
      includePaths: ['./app/css/sass']
    }).on('error', $sass.logError))
    .pipe($autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(configs.sass.dest))
};

function images() {
  return gulp
    .src(configs.img.source)
    .pipe($imagemin())
    .pipe(gulp.dest(configs.img.dest));
};

function json() {
  return gulp
    .src(configs.json.source)
    .pipe($minifyJSON($minifyJSON.MINI))
    .pipe(gulp.dest(configs.json.dest));
};

function bower() {
  return gulp
    .src(configs.html.main, {base: './app'})
    .pipe(wiredep({
      directory: 'bower_components',
      //exclude: ['modernizr']
      //ignorePath: /^(\.\.\/)*\.\.\//
    }))
    .pipe(gulp.dest(configs.html.dest));
};

function vendor() {
  return gulp
    .src(configs.html.main)
    .pipe($useref())
    .pipe($if('**/!(main).js', $uglify()))
    .pipe($if('**/!(main).css', $cleancss({level: {1: {specialComments: 0}}})))
    .pipe(gulp.dest(configs.build.dest));
};

function server() {
  browserSync({
    server: {
      baseDir: 'app',
      index: 'index.html',
      routes: {
        '/bower_components': 'bower_components'
      },
      middleware: ssi({
        baseDir: 'app',
        ext: '.shtm'
      })
    }
  });
  gulp.watch(configs.less.source, gulp.series(less, browserSync.reload));
  gulp.watch(configs.sass.source, gulp.series(sass, browserSync.reload));
  gulp.watch(configs.sync.ext, browserSync.reload);
  gulp.watch('bower.json', gulp.series(bower, browserSync.reload));
}

const serve = gulp.series(bower, server);
//const build = gulp.series(gulp.parallel(less, sass, images, json), bower, vendor);
//const def = gulp.series(gulp.parallel(less, sass, images, json), serve);

exports.less = less;
exports.sass = sass;
exports.images = images;
exports.json = json;
exports.bower = bower;
exports.vendor = vendor;
exports.serve = serve;
//exports.build = build;
//exports.default = def;