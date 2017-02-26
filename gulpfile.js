var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// ---------- MAIN TASKS ---------- //
gulp.task('serve', function(callback) {
    runSequence('browserSync', 'watch', callback);
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'sass',
        ['create:dist', 'images', 'fonts'],
        callback);
});

// ---------- DEVELOPMENT TASKS ---------- //
// Runs static Server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });
});

// Watches .html/.scss/.js files
gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/scripts/main.js', ['jshint']);
    gulp.watch('./src/*.html').on('change', browserSync.reload);
    gulp.watch('./src/scripts/main.js').on('change', browserSync.reload);
});

// Compile .scss into .css & auto-inject into browser
gulp.task('sass', function() {
    return gulp.src('./src/scss/styles.scss')
        .pipe(sass({
          errLogToConsole: true,
          outputStyle: 'expanded'
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});

// Linter
gulp.task('jshint', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// ---------- BUILD TASKS ---------- //
// Creates new .html files with corresponding minified scripts and styles
gulp.task('create:dist', function () {
    return gulp.src('./src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'));
});

// Minifies and creates .images in .dist
gulp.task('images', function(){
    return gulp.src('./src/images/**/*.+(png|jpg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/images'));
});

// Copies fonts from .src to .dist
gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
});

// Deletes .dist
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// Cleares cache
// gulp.task('cache:clear', function(callback) {
//     return cache.clearAll(callback);
// });

gulp.task('default', ['serve']);
