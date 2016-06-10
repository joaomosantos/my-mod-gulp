var gulp = require('gulp'),
menu = require("gulp-menu"),
browserSync = require('browser-sync'),
ssi = require('browsersync-ssi'),
less = require('gulp-less'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifyCSS = require('gulp-minify-css'),
minifyJS = require('gulp-uglify'),
minifyJSON = require("gulp-json-fmt"),
image = require('gulp-image'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
ftp = require('gulp-ftp'),
zip = require('gulp-zip'),
prompt = require('gulp-prompt'),
size = require('gulp-size');

// build configs
var packageName = "pacote";
var folderName = "dev";

// Regex Corrent Path
var regexCorrentPath = /\.\/.+\b\//g;
// Regex Minify js/css
var regexMinify = /\.min/g;

var configs = {
  json: {
    source: './app/json/*.json',
    dest: './app/json/',
  },
  less: {
    source: './app/css/less/*.less',
    dest: './app/css/'
  },
  sass: {
    source: './app/css/sass/*.scss',
    dest: './app/css/'
  },
  css: {
    source: './app/css/*.css',
    dest: './app/css/',
    vendor: './app/css/vendor/'
  },
  js: {
    source: './app/js/*.js',
    dest: './app/js/',
    vendor: './app/js/vendor/'
  },
  sync: {
    ext: [
    './app/{*.html,*.htm,*.shtm,*.shtml}',
    './app/inc/**/.',
    './app/css/**/*.css',
    './app/js/**/*.js',
    './app/template/*.mst',
    './app/json/*.json'
    ]
  },
  img: {
    source: './app/images/**/*',
    dest: './app/images/'
  },
  ftp: {
    source: './build/' + folderName + '/**/.',
    host: '',
    user: '',
    port: '21',
    dest: '/'
  },
  build: {
    source: [
    './app/favicon.ico',
    './app/inc/**/',
    './app/pdf/**/',
    './app/images/**/',
    './app/template/**/',
    './app/json/**/',
    './app/css/**/',
    './app/js/**/',
    './app/{*.html,*.htm,*.shtm,*.shtml}'
    ],
    dest: './build/' + folderName
  },
  zip: {
    source: './build/' + folderName + '/**/.',
    dest: './build/'
  },
  deploy: {
    js: [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/modernizr/modernizr.js',
    './bower_components/respond/src/respond.js'
    ],
    css: [
    './bower_components/normalize-css/normalize.css'
    ]
  }
};

gulp.task('default', function() { menu(this); });

/* Sincronizar browser*/
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './app/',
      index: 'index.html',
      middleware: ssi({
        baseDir: './app/',
        ext: '.shtm'
      })
    }
  });
  gulp.watch(configs.less.source, ['compiler-less'], browserSync.reload);
  gulp.watch(configs.sass.source, ['compiler-sass'], browserSync.reload);
  gulp.watch(configs.sync.ext, browserSync.reload);
});

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src(configs.less.source)
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.less.dest))
  .pipe(browserSync.stream());
});

/* Compilar SASS */
gulp.task('compiler-sass', function() {
  gulp.src(configs.sass.source)
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.sass.dest))
  .pipe(browserSync.stream());
});

// Adicionar auto prefixo
gulp.task('autoprefixer-css', function() {
  gulp.src(configs.css.source)
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.css.dest));
});

//Gerar CSS minificado 
gulp.task('minify-css', function() {
  gulp.src('./app/')
  .pipe(prompt.prompt({
    type: 'input',
    name: 'file',
    message: 'File:'
  }, function(res) {
    correntFile = configs.css.dest + res.file;
    correntPath = regexCorrentPath.exec(correntFile);
    gulp.src(correntFile)
    .pipe(minifyCSS())
    .pipe(rename(function (path) {
      file = regexMinify.test(path.basename);
      if(!file) { path.basename += '.min' }
    }))
    .pipe(gulp.dest(correntPath[0]));
  }));
});

//Gerar JS minificado 
gulp.task('minify-js', function() {
  gulp.src('./app/')
  .pipe(prompt.prompt({
    type: 'input',
    name: 'file',
    message: 'File:'
  }, function(res) {
    correntFile = configs.js.dest + res.file;
    correntPath = regexCorrentPath.exec(correntFile);
    gulp.src(correntFile)
    .pipe(minifyJS())
    .pipe(rename(function (path) {
      file = regexMinify.test(path.basename);
      if(!file) { path.basename += '.min' }
    }))
    .pipe(gulp.dest(correntPath[0]));
  }));
});

// Desminificar .json
gulp.task("unminify-json", function () {
  gulp.src(configs.json.source)
  .pipe(minifyJSON(minifyJSON.PRETTY))
  .pipe(gulp.dest(configs.json.dest));
});

// Minifica .json
gulp.task("minify-json", function () {
  gulp.src(configs.json.source)
  .pipe(minifyJSON(minifyJSON.MINI))
  .pipe(gulp.dest(configs.json.dest));
});

// Comprimir imagem
gulp.task('images', function() {
  gulp.src(configs.img.source)
  .pipe(image())
  .pipe(gulp.dest(configs.img.dest));
});

/* Deploy Components Bower */
gulp.task('deploy-vendor', function() {
  gulp.src(configs.deploy.js).pipe(gulp.dest(configs.js.vendor));
  gulp.src(configs.deploy.css).pipe(gulp.dest(configs.css.vendor));
});

// Gerar build
gulp.task('build', function() {
  gulp.src(configs.build.source, {base: './app/'})
  .pipe(gulp.dest(configs.build.dest));
});

// Compactar build
gulp.task('zip', ['build'], function() {
  gulp.src(configs.zip.source, {base: './build'})
  .pipe(zip(packageName+'.zip'))
  .pipe(size({ showFiles: true, showTotal: false }))
  .pipe(gulp.dest(configs.zip.dest));
});

// Transferir via FTP
gulp.task('ftp', ['build'], function() {
  gulp.src('./app/')
  .pipe(prompt.prompt({
    type: 'password',
    name: 'pass',
    message: 'Please enter your password'
  }, function(res) {
    gulp.src(configs.ftp.source, {base: './build'})
    .pipe(ftp({
      host: configs.ftp.host,
      port: configs.ftp.port,
      user: configs.ftp.user,
      pass: res.pass,
      remotePath: configs.ftp.dest
    }).on('error', function() {
      console.log('## Password invalid.');
      process.exit(true);
    }));
  }));
});
