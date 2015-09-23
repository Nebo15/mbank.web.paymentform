var gulp         = require('gulp'),
    path         = require('path'),
    argv         = require('yargs').argv,
    clean        = require('gulp-clean'),
    browserSync  = require('browser-sync'),
    gulpif       = require('gulp-if'),
    compass      = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    svgmin       = require('gulp-svgmin'),
    svgmin       = require('gulp-concat'),
    svgSprite    = require('gulp-svg-sprite'),
    browserSync  = require('browser-sync'),
    htmlmin      = require('gulp-htmlmin'),
    uglify       = require('gulp-uglify');

// Web Server
gulp.task('server', function() {
    browserSync({
        server: {
            baseDir: './www',
            index: 'index.html'
        },
        files: ["www/css/*.css", "www/*.html", "www/js/**/*.js"],
        port: 8080,
        open: true,
        notify: false,
        ghostMode: false
    });
});

// Clean temporary folders
gulp.task('clean', function () {
    return gulp.src(['www','.sass-cache', '.tmp'], {read: false})
        .pipe(clean());
});

// SASS to CSS
gulp.task('build-styles', function() {
    return gulp.src('src/sass/**/*.sass')
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
    return gulp.src('src/img/**/*', {base: './src'})
        .pipe(gulp.dest('./www'));
});

// HTML minify
gulp.task('build-html', function() {
  return gulp.src('./src/html/*.html')
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

// Build javascript
gulp.task('build-scripts', ['build-html'], function() {
    return gulp.src('src/js/**/*.js', {base: './src'})
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./www'));
});

// Watch for for changes
gulp.task('watch', function() {
    gulp.watch('src/sass/**/*', ['build-styles']);
    gulp.watch('src/images/**/*', ['build-images']);
    gulp.watch('src/html/**/*', ['build-html']);
    gulp.watch('src/fonts/**/*', ['build-fonts']);
    gulp.watch('src/js/**/*', ['build-scripts']);
});

gulp.task('default', ['build', 'server', 'watch'], function() {});
gulp.task('build', ['clean', 'build-html', 'build-styles', 'build-images', 'build-fonts', 'build-scripts'], function() {});
