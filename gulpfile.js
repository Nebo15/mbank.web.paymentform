var gulp         = require('gulp'),
    sequence     = require('gulp-sequence');
    debug        = require('gulp-debug');
    path         = require('path'),
    argv         = require('yargs').argv,
    clean        = require('gulp-clean'),
    browserSync  = require('browser-sync'),
    inject       = require('gulp-inject'),
    gulpif       = require('gulp-if'),
    compass      = require('gulp-compass'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    svgmin       = require('gulp-svgmin'),
    svgSprite    = require('gulp-svg-sprite'),
    browserSync  = require('browser-sync'),
    htmlmin      = require('gulp-htmlmin'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify');

var additinal_scripts = [
    './src/bower/jquery/dist/jquery.js',
    './src/bower/jquery-creditcardvalidator/jquery.creditCardValidator.js',
    './src/bower/jquery-mask-plugin/dist/jquery.mask.js',
    './src/bower/jquery-validation/dist/jquery.validate.js',

];
var additinal_styles = [];

// Web Server
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: './www',
            index: 'index.html'
        },
        files: ["./www/css/*.css", "./www/*.html", "./www/js/**/*.js"],
        port: 8080,
        open: true,
        notify: false,
        ghostMode: false
    });
});

// Clean temporary folders
gulp.task('clean', function () {
    return gulp.src(['./www','./.sass-cache', './.tmp', './src/js/lib'], {read: false})
        .pipe(clean());
});

// SASS to CSS
gulp.task('build-styles', function() {
    return gulp.src('./src/sass/**/*.sass')
        .pipe(compass({
            project: path.join(__dirname, ''),
            http_images_path: '/img',
            generated_images_path: 'www/img',
            http_path: '/',
            css: 'www/css',
            sass: 'src/sass',
            image: 'src/img',
            debug: true,
            relative: true,
            style: argv.production ? 'compressed' : 'nested'
        }))
        .pipe(autoprefixer({
            browsers: ['last 4 versions', 'ie 8'],
            cascade: false
        }))
        .pipe(gulp.dest('./www/css'));
});

// SVG to SVG sprites
gulp.task('build-images', function() {
    return gulp.src('./src/img/**/*', {base: './src'})
        .pipe(gulp.dest('./www'));
});

// HTML minify
gulp.task('build-html', ['build-styles', 'build-scripts'], function() {
  var injected_head = gulp.src([
    './www/css/screen.css'
  ], {read: false, base: '/www'});

  var injected = gulp.src([
    './www/js/{lib,*}/{jquery,*}.js',
    './www/js/*.js',
    './www/css/*.css',
    '!./www/css/screen.css'
  ], {read: false, base: '/www'});

  return gulp.src('./src/html/**/*.html')
    .pipe(inject(injected_head, {ignorePath: '/www', name: 'head'}))
    .pipe(inject(injected, {ignorePath: '/www'}))
    .pipe(htmlmin({
        collapseWhitespace: argv.production ? true : false,
        removeComments: argv.production ? true : false,
    }))
    .pipe(gulp.dest('./www'))
});

// Move fonts to www
gulp.task('build-fonts', function() {
    return gulp.src('src/fonts/**/*', {base: './src'})
        .pipe(gulp.dest('./www'));
});

// Build and move javascript
gulp.task('build-scripts-lagpack', function() {
    return gulp.src('./src/js/lang/**/*.js', {base: './src'})
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./www'));
});

gulp.task('bower-install-scripts', function() {
    return gulp.src(additinal_scripts, {base: './src'})
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./src/js/lib'));
});

gulp.task('build-scripts', ['build-scripts-lagpack', 'bower-install-scripts'], function() {
    return gulp.src(['./src/js/lib/{jquery,*}.js', './src/js/*.js'], {base: './src'})
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulpif(argv.production, concat('js/all.js')))
        .pipe(gulp.dest('./www'));
});

// Watch for for changes
gulp.task('watch', function() {
    gulp.watch('./src/sass/**/*', ['build-styles']);
    gulp.watch('./src/img/**/*', ['build-images', 'build-styles']);
    gulp.watch('./src/html/**/*', ['build-html']);
    gulp.watch('./src/fonts/**/*', ['build-fonts']);
    gulp.watch('./src/js/**/*', ['build-scripts']);
    gulp.watch('./bower/**/*.js', ['build-scripts']);
});

// Base tasks
gulp.task('default', sequence('build', ['server', 'watch']));
gulp.task('build', sequence('clean', ['build-images', 'build-fonts', 'build-styles', 'build-scripts'], 'build-html'));
