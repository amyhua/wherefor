var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function() {
  return gulp.src('./src/app-bundle.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/'));
});

gulp.task('default', function() {
    return gulp.src('src/**/*.js')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/components/**/*.less', ['less']); 
});