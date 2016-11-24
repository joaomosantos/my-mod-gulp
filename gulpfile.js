var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync'), ssi = require('browsersync-ssi');
var $ = require('gulp-load-plugins')({
  rename: {
    'gulp-minify-css': 'minifyCSS',
    'gulp-json-fmt': 'minifyJSON'
  }
});

// build configs
var packageName = "pacote";
var folderName = "./build/dev";

var configs = {
  sync: {
    ext: [
    './app/*.{html,htm,shtm,shtml}',
    './app/inc/**/*.{html,htm,shtm,shtml}',
    './app/css/**/*.css',
    './app/js/**/*.js',
    './app/template/*.mst',
    './app/json/*.json'
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
    source: './app/css/sass/*.scss',
    main: './app/css/sass/main.scss',
    dest: './app/css/'
  },
  json: {
    source: './app/json/*.json',
    dest: folderName + '/json/'
  },
  img: {
    source: './app/images/**/*',
    dest: folderName + '/images/'
  },
  zip: {
    source: folderName + '/**/.',
    dest: './build/'
  },
  ftp: {
    source: folderName + '/**/*',
    host: '',
    user: '',
    pass: '',
    port: '21',
    dest: '/'
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
    dest: folderName
  },
};

gulp.task('default', function() {});

gulp.task('server', ['bower'], function() {
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
  gulp.watch(configs.less.source, ['compiler-less'], browserSync.reload);
  gulp.watch(configs.sass.source, ['compiler-sass'], browserSync.reload);
  gulp.watch(configs.sync.ext, browserSync.reload);
  gulp.watch('bower.json', ['bower'], browserSync.reload);
});

gulp.task('server:build', function() {
  browserSync({
    server: {
      baseDir: folderName,
      index: 'index.html',
      middleware: ssi({
        baseDir: folderName,
        ext: '.shtm'
      })
    }
  });
});

gulp.task('bower', function() {
  gulp.src(configs.html.main, {base: './app'})
  .pipe(wiredep({
    directory: 'bower_components',
    exclude: ['modernizr']
    //ignorePath: /^(\.\.\/)*\.\.\//
  }))
  .pipe(gulp.dest(configs.html.dest));
});

gulp.task('compiler-less', function() {
  gulp.src(configs.less.main)
  .pipe($.less())
  .pipe($.autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.less.dest))
  .pipe(browserSync.stream());
});

gulp.task('compiler-sass', function() {
  gulp.src(configs.sass.main)
  .pipe($.sass({
    includePaths: ['./app/css/sass']
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.sass.dest))
  .pipe(browserSync.stream());
});

gulp.task('zip', ['build'], function() {
  gulp.src(configs.zip.source, {base: './build'})
  .pipe($.zip(packageName+'.zip'))
  .pipe($.size({ showFiles: true, showTotal: false }))
  .pipe(gulp.dest(configs.zip.dest));
});

gulp.task('ftp', function() {
  return gulp.src(configs.ftp.source)
  .pipe($.ftp({
    host: configs.ftp.host,
    port: configs.ftp.port,
    user: configs.ftp.user,
    pass: configs.ftp.pass,
    remotePath: configs.ftp.dest
  }));
});

gulp.task('build', ['vendor', 'json', 'images'], function() {
  gulp.src(configs.build.source, {base: './app/'})
  .pipe(gulp.dest(configs.build.dest));
});

gulp.task('vendor', function() {
  gulp.src(configs.html.main)
  .pipe($.useref())
  .pipe($.if('**/!(main).js', $.uglify()))
  .pipe($.if('**/!(main).css', $.minifyCSS()))
  .pipe(gulp.dest(configs.build.dest));
});

gulp.task("json", function () {
  gulp.src(configs.json.source)
  .pipe($.minifyJSON($.minifyJSON.MINI))
  .pipe(gulp.dest(configs.json.dest));
});

gulp.task('images', function() {
  gulp.src(configs.img.source)
  .pipe($.imagemin())
  .pipe(gulp.dest(configs.img.dest));
});