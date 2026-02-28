const gulp = require('gulp');
const wpPot = require('gulp-wp-pot');
const checktextdomain = require('gulp-checktextdomain');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');

const SOURCE = ['scss/*.scss'];
const DESTINATION = './css/';

// Compile Sass
function compileSass() {
    return gulp.src(SOURCE)
        .pipe(sourcemaps.init())
        .pipe(changed(DESTINATION))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DESTINATION))
        .pipe(browserSync.stream());
}

// Generate POT file
function generatePot() {
    return gulp.src('**/*.php')
        .pipe(wpPot({
            domain: 'mold-plot',
            package: 'Mold Plot'
        }))
        .pipe(gulp.dest('languages/mold-plot.pot'));
}

// Check text domains
function checkTextDomain() {
    return gulp.src('**/*.php')
        .pipe(checktextdomain({
            text_domain: 'mold-plot',
            keywords: [
                '__:1,2d',
                '_e:1,2d',
                '_x:1,2c,3d',
                'esc_html__:1,2d',
                'esc_html_e:1,2d',
                'esc_html_x:1,2c,3d',
                'esc_attr__:1,2d',
                'esc_attr_e:1,2d',
                'esc_attr_x:1,2c,3d',
                '_ex:1,2c,3d',
                '_n:1,2,4d',
                '_nx:1,2,4c,5d',
                '_n_noop:1,2,3d',
                '_nx_noop:1,2,3c,4d'
            ]
        }));
}

// Watch files
function watchFiles() {
    gulp.watch('scss/**/*.scss', compileSass);
}

// Define tasks
exports.sass = compileSass;
exports.checkpot = generatePot;
exports.checktextdomain = checkTextDomain;
exports.watch = watchFiles;

// Default task
exports.default = gulp.series(
    compileSass,
    generatePot,
    checkTextDomain
);
