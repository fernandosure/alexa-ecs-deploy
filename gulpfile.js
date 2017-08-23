var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var path = require('path');
var expect = require('gulp-expect-file');
var cleanCSS = require('gulp-clean-css');


var paths = {
    scripts : {
        header : [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',

        ],
        footer: [
            'bower_components/auth0.js/build/auth0.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-auth0/dist/angular-auth0.js',
            'bower_components/angular-jwt/dist/angular-jwt.js'
        ]
    },
    styles : [
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css'
    ]
};


var buildPath = path.join(__dirname, 'src/angular_app/assets/build');

gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([buildPath]);
});

gulp.task('header_scripts', ['clean'], function() {
    return gulp.src(paths.scripts.header)
        .pipe(expect(paths.scripts.header))
        .pipe(sourcemaps.init())
        // .pipe(uglify())
        .pipe(concat('header.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(buildPath,'js')));
});

gulp.task('footer_scripts', ['clean'], function() {
    return gulp.src(paths.scripts.footer)
        .pipe(expect(paths.scripts.footer))
        .pipe(sourcemaps.init())
        // .pipe(uglify())
        .pipe(concat('footer.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(buildPath,'js')));
});

gulp.task('styles', ['clean'], function() {
    return gulp.src(paths.styles)
        .pipe(expect(paths.styles))
        .pipe(sourcemaps.init())
        // .pipe(cleanCSS())
        .pipe(concat('styles.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(buildPath,'css')));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts.header, ['header_scripts']);
    gulp.watch(paths.scripts.header, ['footer_scripts']);
    gulp.watch(paths.styles, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'header_scripts', 'footer_scripts', 'styles']);