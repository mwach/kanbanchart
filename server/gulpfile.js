var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');

gulp.task('test', function(){
  gulp.src('app/tests/*.js').pipe(mocha()).on('error', function(err){
    this.emit('end');
  });
});

gulp.task('serve', function () {
  nodemon({
    script: 'server.js',
  })
})

gulp.task('watch', function(){
	gulp.watch('**/*.js', ['test']);
});

gulp.task('default', ['serve', 'watch']);
