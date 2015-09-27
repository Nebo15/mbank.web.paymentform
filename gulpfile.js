var gulp         = require('gulp'),
    zip          = require('gulp-zip'),
    sequence     = require('gulp-sequence'),
    debug        = require('gulp-debug'),
    merge        = require('merge-stream'),
    path         = require('path'),
    argv         = require('yargs').argv,
    prefix       = require('gulp-prefix'),
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
    uglify       = require('gulp-uglify'),
    htmlReplace  = require('gulp-html-replace'),
    htmlsplit    = require('gulp-htmlsplit'),
    replace      = require('gulp-replace'),
    convertEncoding = require('gulp-convert-encoding');

var additinal_scripts = [
    './src/bower/jquery/dist/jquery.js',
    './src/bower/jquery-creditcardvalidator/jquery.creditCardValidator.js',
    './src/bower/jquery-mask-plugin/dist/jquery.mask.js',
    './src/bower/jquery-validation/dist/jquery.validate.js'
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
    return gulp.src(['./www', './dist', './.sass-cache', './.tmp', './src/js/lib'], {read: false})
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
    return gulp.src(['./src/img/**/*', '!./src/img/icons/**/*'], {base: './src'})
        .pipe(gulp.dest('./www'));
});

// Static files
gulp.task('build-statics', function() {
    return gulp.src(['./src/static/**/*'], {base: './src/static'})
        .pipe(gulp.dest('./www'));
});

// HTML processing and optimization
gulp.task('build-html', function() {
  var injected_head = gulp.src([
    './www/css/screen.css'
  ], {read: false, base: '/www'});

  var injected = gulp.src([
    './www/js/{lib,*}/{jquery,*}.js',
    './www/js/*.js',
    './www/css/*.css',
    '!./www/css/screen.css'
  ], {read: false, base: '/www'});

  return gulp.src(['./src/html/**/*.html', '!./src/html/success.html'])
    .pipe(inject(injected_head, {ignorePath: '/www', name: 'head'}))
    .pipe(inject(injected, {ignorePath: '/www'}))
    .pipe(htmlmin({
        collapseWhitespace: argv.production ? true : false,
        removeComments: argv.production ? true : false,
    }))
    .pipe(gulpif(argv.view, replace(/\$\{[^\}]*\}/g, '')))
    .pipe(gulp.dest('./www'));
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
    gulp.watch('./static/**/*', ['build-statics']);
});

// Prepare IPSP template
gulp.task('html-split', function () {
    return gulp.src('www/**/*.html')
        .pipe(htmlsplit())
        .pipe(gulp.dest('www'));
});

gulp.task('html-remove', function () {
    return gulp.src('www/index.html')
        .pipe(htmlReplace({
            form: '${form}'
        }))
        .pipe(rename({
            basename: 'page'
        }))
        .pipe(gulp.dest('www'));
});

// Export everything for IPSP
gulp.task('build-dist', function() {
    var assets = gulp.src('./www/{css,img,js,fonts}/**/*', {base: './www'})
        .pipe(gulp.dest('./dist/ROOT/stat/frontend/design/best_wallet/'));

    var prefixUrl = "/stat/frontend/design/best_wallet";
    var html = gulp.src(['./www/**/*.html', '!./www/index.html', './www/**/*.properties'], {base: './www'})
        .pipe(prefix(prefixUrl))
        .pipe(gulp.dest('./dist/frontend/design/best_wallet/'));

    return merge(assets, html);
});

gulp.task('dist-clone-html', function() {
  return gulp.src(['./dist/frontend/design/best_wallet/**/{page,form}.html'])
    .pipe(rename({
        suffix: '_iframe'
    }))
    .pipe(gulpif('**/page_iframe.html', replace(/<body/g, '<body class="iframe"')))
    .pipe(gulp.dest('./dist/frontend/design/best_wallet/'));
});

gulp.task('dist-change-encoding', function() {
  return gulp.src(['./dist/frontend/design/best_wallet/**/*.html'])
    .pipe(convertEncoding({to: argv.encoding}))
    .pipe(gulp.dest('./dist/frontend/design/best_wallet/'));
});

gulp.task('dist-create-archive', function () {
    return gulp.src('dist/**/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

// Export shortcut
gulp.task('export', sequence('build', 'html-split', 'html-remove', 'build-dist', 'dist-clone-html'));

// Base tasks
gulp.task('default', sequence('build', ['server', 'watch']));
gulp.task('build', sequence('clean', ['build-images', 'build-fonts', 'build-styles', 'build-scripts', 'build-statics'], 'build-html'));
