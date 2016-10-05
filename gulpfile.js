const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const minifycss = require('gulp-clean-css');
const postcss = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const sh = require('shelljs');
const typescript = require('gulp-tsc');
const copy = require('gulp-copy');
const jsmin = require('gulp-jsmin');
const exec = require('child_process').exec;

const paths = {
  sass: ['./src/scss/**/*.scss'],
  src: ['./src/ts/*.ts'],
  html: ['./src/**/*.html'],
  js: [
    './src/lib/ionic/js/ionic.bundle.min.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js'
  ],
  fonts: ['./src/lib/ionic/fonts/*']
};

const AUTOPREFIXER_BROWSERS = [
  'Explorer >= 10',
  'ExplorerMobile >= 10',
  'Firefox >= 30',
  'Chrome >= 34',
  'Safari >= 7',
  'Opera >= 23',
  'iOS >= 7',
  'Android >= 4.4'
];

gulp.task('default', ['sass', 'compile', 'html-copy', 'js-copy', 'fonts-copy']);

gulp.task('sass', done => {
  gulp.src('./src/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifycss({
      keepSpecialComments: 0
    }))
    .pipe(postcss([autoprefixer({browsers: AUTOPREFIXER_BROWSERS})]))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('compile', () => {
  gulp.src(paths.src)
    .pipe(typescript({
      emitError: false
    }))
    .pipe(jsmin())
    .pipe(gulp.dest('./www/js/'))
});

gulp.task('html-copy', () => {
  gulp.src(paths.html)
    .pipe(copy('./www/', {prefix: 1}));
});

gulp.task('js-copy', () => {
  gulp.src(paths.js)
    .pipe(copy('./www/', {prefix: 1}));
});

gulp.task('fonts-copy', () => {
  gulp.src(paths.fonts)
    .pipe(copy('./www/', {prefix: 1}));
});

gulp.task('serve', ['default'], () => {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.src, ['compile']);
  gulp.watch(paths.html, ['html-copy']);
  gulp.watch(paths.js, ['js-copy']);
  gulp.watch(paths.js, ['fonts-copy']);
  exec('ionic serve');
});

gulp.task('install', ['git-check'], () => {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', done => {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
