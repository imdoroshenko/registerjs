var gulp = require('gulp'),
    concat = require('gulp-concat'),
    srcPath = './src',
    mainPath = './';


gulp.task('concat', function(cb) {
    gulp.src([srcPath + '/register.js', srcPath + '/registerclass.js', srcPath + '/index.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(mainPath));
    cb();
});


gulp.task('default', ['concat']);