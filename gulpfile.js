var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    del    = require('del');

gulp.task('minify', function () {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    del('dist', cb);
});

gulp.task('default', ['clean', 'minify']);