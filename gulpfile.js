var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var useref = require('node-useref');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('less', function() {
  return gulp.src('./src/app-bundle.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/'));
});
 
gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/components/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('watch', function() {
  gulp.watch('src/components/**/*.less', ['less']); 
  gulp.watch('src/components/**/*.js', ['compress']); 
});