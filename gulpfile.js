var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    del    = require('del'),
    karma  = require('karma').server;

gulp.task('minify', function () {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    del('dist', cb);
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun:  true
    }, done);
});

gulp.task('build', ['minify']);

gulp.task('default', ['clean', 'test', 'build']);