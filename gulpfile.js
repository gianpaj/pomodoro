var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    // open the proxied app in chrome
    browser: ['google-chrome']
  });
});

// Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(paths.scripts, ['scripts']);
//   gulp.watch(paths.images, ['images']);
// });

gulp.task('css', function () {
  return gulp.src('public/css/*.css')
    .pipe(browserSync.reload({ stream: true }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['browser-sync'], function() {
  gulp.watch('views/*.jade', browserSync.reload);
  gulp.watch('public/js/*.js', browserSync.reload);
  gulp.watch('public/**/*.css', ['css']);
});
