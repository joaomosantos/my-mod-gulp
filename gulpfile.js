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

// Regex Corrent Path
var regexCorrentPath = /\.\/.+\b\//g;
// Regex Minify js/css
var regexMinify = /\.min/g;

var configs = {
  sync: {
    ext: [
    './app/*.{html,htm,shtm,shtml}',
    './app/inc/**/.',
    './app/css/**/*.css',
    './app/js/**/*.js',
    './app/template/*.mst',
    './app/json/*.json'
    ]
  },
  html: {
    source: [
    './app/*.{html,htm,shtm,shtml}',
    './app/inc/**/*.{html,htm,shtm,shtml}'
    ],
    main: './app/*.{html,htm,shtm,shtml}',
    inc: './app/inc/**/*.{html,htm,shtm,shtml}',
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
  css: {
    source: './app/css/*.css',
    dest: './app/css/'
  },
  js: {
    source: './app/js/*.js',
    dest: './app/js/'
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
    './app/favicon.ico',
    './app/pdf/*.pdf',
    './app/template/*.mst',
    './app/css/*.css',
    './app/js/*.js',
    ],
    inc: folderName + '/inc/',
    dest: folderName
  },
};

gulp.task('default', function() {});

gulp.task('server', function() {
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

gulp.task('bower', function() {
  gulp.src(configs.html.source, {base: './app'})
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
  .pipe($.sass())
  .pipe($.autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.sass.dest))
  .pipe(browserSync.stream());
});

gulp.task('minify-css', function() {
  gulp.src('./app/')
  .pipe($.prompt.prompt({
    type: 'input',
    name: 'file',
    message: 'File:'
  }, function(res) {
    correntFile = configs.css.dest + res.file;
    correntPath = regexCorrentPath.exec(correntFile);
    gulp.src(correntFile)
    .pipe($.minifyCSS())
    .pipe($.rename(function (path) {
      file = regexMinify.test(path.basename);
      if(!file) { path.basename += '.min' }
    }))
    .pipe(gulp.dest(correntPath[0]));
  }));
});

gulp.task('minify-js', function() {
  gulp.src('./app/')
  .pipe($.prompt.prompt({
    type: 'input',
    name: 'file',
    message: 'File:'
  }, function(res) {
    correntFile = configs.js.dest + res.file;
    correntPath = regexCorrentPath.exec(correntFile);
    gulp.src(correntFile)
    .pipe($.uglify())
    .pipe($.rename(function (path) {
      file = regexMinify.test(path.basename);
      if(!file) { path.basename += '.min' }
    }))
    .pipe(gulp.dest(correntPath[0]));
  }));
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
  .pipe(gulp.dest(configs.build.dest));
  gulp.src(configs.html.inc)
  .pipe($.useref())
  .pipe(gulp.dest(configs.build.inc));
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