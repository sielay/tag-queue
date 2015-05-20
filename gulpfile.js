var gulp = require ('gulp'),
    uglify = require ('gulp-uglify'),
    gzip = require ('gulp-gzip'),
    wrap = require ('gulp-wrap'),
    replace = require ('gulp-replace'),
    rename = require ('gulp-rename');

gulp.task ('compress', function () {
    gulp.src ('index.js')
        .pipe (uglify ({
        bracketize : true
    }))
        .pipe (gulp.dest ('dist'))
        .pipe (gzip ())
        .pipe (gulp.dest ('dist'));

    gulp.src ('index.js')
        .pipe (replace (/\/\* UMD \*\/([\s\S]*?)\/\* \/UMD \*\//, ''))
        .pipe (wrap('(function(win) { <%= contents %>!tagQueueFactory(win); })(window);'))
        .pipe (uglify ({
        bracketize : true
    }))
        .pipe (rename (function (path) {
        path.basename += "-tealium";
    }))
        .pipe (gulp.dest ('dist'));

});