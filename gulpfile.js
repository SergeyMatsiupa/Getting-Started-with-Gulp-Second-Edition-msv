// Load Node Modules/Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
// var myth = require('gulp-myth');
var uglify = require('gulp-uglify'); // Newly Added
var jshint = require('gulp-jshint'); // Newly Added
var imagemin = require('gulp-imagemin');
var connect = require('connect'); // Added
var serve = require('serve-static'); // Added
var browsersync = require('browser-sync'); // Added
var postcss = require('gulp-postcss'); // Added
var cssnext = require('postcss-cssnext'); // Added
var cssnano = require('cssnano'); // Added
var browserify = require('browserify'); // Added
var source = require('vinyl-source-stream'); // Added
var buffer = require('vinyl-buffer'); // Added
var babelify = require('babelify'); // Added
var plumber = require('gulp-plumber'); // Added
//!depr var beeper = import('beeper'); // Added
// import beeper from 'beeper';
var del = require('del'); // Added
var config = require('./config.json');
var sourcemaps = require('gulp-sourcemaps'); // Added

// Error Handler
async function onError(err) {
    // await beeper();
    console.log('Name:', err.name);
    console.log('Reason:', err.reason);
    console.log('File:', err.file);
    console.log('Line:', err.line);
    console.log('Column:', err.column);
}

gulp.task('clean', function () {
    return del(['dist/*']);
});

var cssFiles = ['app/css/main.css', 'app/css/*.css'];
// Styles Task
gulp.task('styles', function() {
    // return gulp.src('app/css/*.css')
    return gulp.src(cssFiles)
        .pipe(plumber(
            {
            errorHandler: onError
            }
        ))
        .pipe(concat('all.css'))
        // .pipe(myth())
        .pipe(postcss([
            cssnext(),
            cssnano()
        ]))
        .pipe(plumber.stop())
        .pipe(gulp.dest(config.css.dest));
});

// gulp.task('styles', function() {
//     return gulp.src('app/css/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('dist'));
// });

// Scripts Task
gulp.task('scripts', function() {
    return gulp.src('app/js/*.js')      
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('dist/maps')) // Added
        .pipe(gulp.dest('dist'));
});

// Images Task
gulp.task('images', function() {
    return gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// BrowserSync Task
gulp.task('browsersync', function() {
    return browsersync({
        server: {
                baseDir: './'
        }
    });
});

function browsersyncReload(cb){
    browsersync.reload();
    cb();
  }
//   MSV!!!

// Watch Task
gulp.task('watch', function() {
    // gulp.watch('app/css/*.css', gulp.series('clean','styles',  browsersyncReload));
    gulp.watch('app/css/*.css', gulp.series('styles',  browsersyncReload));
    gulp.watch('app/js/*.js', gulp.series('scripts',  browsersyncReload));
    gulp.watch('app/img/*', gulp.series('images',  browsersyncReload));
});

// Server Task
gulp.task('server', function() {
    return connect().use(serve(__dirname))
        .listen(8080)
        .on('listening', function() {
        console.log('Server Running: View at http://localhost:8080');
        });
    });

// Browserify Task
gulp.task('browserify', function() {
    return browserify('./app/js/app.js')
        .transform('babelify', {
            presets: ['env']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'));
    });



// Default Task
// gulp.task('default', gulp.parallel('styles', 'scripts', 'images', 'browsersync', 'watch'));
gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts', 'browserify', 'images', 'browsersync', 'watch')));
