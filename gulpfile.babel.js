// Load Node Modules/Plugins
import gulp from 'gulp';
import concat from 'gulp-concat';
// import myth from 'gulp-myth';
import uglify from 'gulp-uglify'; 
import jshint from 'gulp-jshint'; 
import imagemin from 'gulp-imagemin';
import connect from 'connect';
import serve from 'serve-static';
import browsersync from 'browser-sync';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';
import plumber from 'gulp-plumber';
//!depr import beeper = import('beeper';
// import beeper from 'beeper';
import del from 'del';
import config from './config.json';
import sourcemaps from 'gulp-sourcemaps';

import regeneratorRuntime from "regenerator-runtime";


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
        console.log('gulp.babel-clean');
    return del(['dist/*']);
});

var cssFiles = ['app/css/main.css', 'app/css/*.css'];
// Styles Task
gulp.task('styles', () => {
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

// gulp.task('styles', () => {
//     return gulp.src('app/css/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('dist'));
// });

// Scripts Task
gulp.task('scripts', () => {
    return gulp.src('app/js/*.js')      
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('dist/maps'))
        .pipe(gulp.dest('dist'));
});

// Images Task
gulp.task('images', () => {
    return gulp.src('app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// BrowserSync Task
gulp.task('browsersync', () => {
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
gulp.task('watch', () => {
    // gulp.watch('app/css/*.css', gulp.series('clean','styles',  browsersyncReload));
    gulp.watch('app/css/*.css', gulp.series('styles',  browsersyncReload));
    gulp.watch('app/js/*.js', gulp.series('scripts',  browsersyncReload));
    gulp.watch('app/img/*', gulp.series('images',  browsersyncReload));
});

// Server Task
gulp.task('server', () => {
    return connect().use(serve(__dirname))
        .listen(8080)
        .on('listening', () => {
        console.log('Server Running: View at http://localhost:8080');
        });
    });

// Browserify Task
gulp.task('browserify', () => {
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
