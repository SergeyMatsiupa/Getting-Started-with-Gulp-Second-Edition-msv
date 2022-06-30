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
import del from 'del';
import config from './config.json';
import sourcemaps from 'gulp-sourcemaps';

import regeneratorRuntime from "regenerator-runtime";


// Error Handler
async function onError(err) {
    console.log('Name:', err.name);
    console.log('Reason:', err.reason);
    console.log('File:', err.file);
    console.log('Line:', err.line);
    console.log('Column:', err.column);
}

var cssFiles = ['app/css/main.css', 'app/css/*.css'];
// Styles Task
gulp.task('styles', () => {
    return gulp.src(cssFiles)
        .pipe(plumber(
            {
            errorHandler: onError
            }
        ))
        .pipe(concat('all.css'))
        .pipe(postcss([
            cssnext(),
            cssnano()
        ]))
        .pipe(plumber.stop())
        .pipe(gulp.dest(config.css.dest));
});

