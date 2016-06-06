var gulp = require('gulp'),
less = require('gulp-less'),
minifyCSS = require('gulp-minify-css'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
browserSync = require('browser-sync'),
ssi = require('browsersync-ssi'),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
image = require('gulp-image'),
ftp = require('gulp-ftp'),
zip = require('gulp-zip'),
prompt = require('gulp-prompt'),
jade = require('gulp-jade'),
xls2json = require('gulp-sheets2json'),
jsonFmt = require("gulp-json-fmt"),
less2sass = require('gulp-less2sass');

// build configs
var packageName = "pacote";
var folderName = "dev";

var configs = {
  json: {
    source: './app/json/*.json',
    dest: './app/json/',
  },
  xls: {
    source: './app/xls/{*.xls,*.xlsx}',
    dest: './app/json/',
    plan: '' //All Plan(Tabs) Or plan: '+(Plan1|Plan3)'
  },
  jade: {
    source: './app/*.jade',
    dest: './app/'
  },
  less: {
    source: './app/css/less/*.less',
    dest: './app/css/'
  },
  sass: {
    source: './app/css/sass/*.scss',
    dest: './app/css/',
    root: './app/css/sass/'
  },
  css: {
    source: './app/css/*.css',
    dest: './app/css/final/',
    main: 'all.css',
    root: './app/css/',
    vendor: './app/css/vendor/'
  },
  js: {
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
      './app/xls/**/',
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
      './bower_components/modernizr/modernizr.js'
    ],
    css: [
      './bower_components/normalize-css/normalize.css'
    ]
  }
};

gulp.task('default', function() {});

/* Deploy Components Bower */
gulp.task('bower-deploy', function() {
  gulp.src(configs.deploy.js).pipe(gulp.dest(configs.js.vendor));
  gulp.src(configs.deploy.css).pipe(gulp.dest(configs.css.vendor));
});

/* Compilar Jade */
gulp.task('compiler-jade', function() {
  gulp.src(configs.jade.source)
  .pipe(jade())
  .pipe(gulp.dest(configs.jade.dest))
  .pipe(browserSync.stream());
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

/*Convert lESS to SASS*/
gulp.task('less2sass', function() {
	gulp.src(configs.less.source)
	 .pipe(less2sass())
   .pipe(gulp.dest(configs.sass.root));
});

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
  gulp.watch(configs.jade.source, ['compiler-jade'], browserSync.reload);
  gulp.watch(configs.sync.ext, browserSync.reload);
});

/* Concatenar em um único CSS */
gulp.task('concat-css', function() {
  gulp.src(configs.css.source)
  .pipe(concat(configs.css.main))
  .pipe(gulp.dest(configs.css.dest));
});

/* Gerar CSS minificado */
gulp.task('minify-css', ['concat-css'], function() {
  gulp.src(configs.css.dest + configs.css.main)
  .pipe(minifyCSS())
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest(configs.css.dest));
});

// Adicionar auto prefixo
gulp.task('autoprefixer-css', function() {
  gulp.src(configs.css.source)
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.css.root));
});

// Comprimir imagem
gulp.task('images', function() {
  gulp.src(configs.img.source)
    .pipe(image())
    .pipe(gulp.dest(configs.img.dest));
});

// Transferir via FTP
gulp.task('ftp', function() {
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

// Gerar build
gulp.task('build', function() {
  gulp.src(configs.build.source, {base: './app/'})
    .pipe(gulp.dest(configs.build.dest));
});

// Compactar build
gulp.task('zip', ['build'], function() {
  gulp.src(configs.zip.source, {base: './build'})
  .pipe(zip(packageName+'.zip'))
  .pipe(gulp.dest(configs.zip.dest));
});

// Converter .xls and .xlsx para .json
gulp.task("xls2json", function () {
  gulp.src(configs.xls.source)
    .pipe(xls2json({ filter: configs.xls.plan }))
    .pipe(jsonFmt(jsonFmt.PRETTY))
    .pipe(gulp.dest(configs.xls.dest));
});

// Desminificar .json
gulp.task("json-unminify", function () {
  gulp.src(configs.json.source)
    .pipe(jsonFmt(jsonFmt.PRETTY))
    .pipe(gulp.dest(configs.json.dest));
});

// Minifica .json
gulp.task("json-minify", function () {
  gulp.src(configs.json.source)
    .pipe(jsonFmt(jsonFmt.MINI))
    .pipe(gulp.dest(configs.json.dest));
});
