const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('build'));

gulp.task('watch', gulp.parallel('build', function () {
  gulp.watch('src/**/*.ts', gulp.series('build'));
}));