var gulp = require ('gulp'),
    uglify = require ('gulp-uglify'),
    gzip = require ('gulp-gzip');

gulp.task ('compress', function () {
    gulp.src ('index.js')
        .pipe (uglify ({
        bracketize: true
    }))
        .pipe (gulp.dest ('dist'))
        .pipe (gzip ())
        .pipe (gulp.dest ('dist'))
});