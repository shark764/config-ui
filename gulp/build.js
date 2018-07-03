'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});

module.exports = function(options) {
  gulp.task('partials', ['markups'], function () {
    return gulp.src([
      options.src + '/app/**/*.html',
      options.tmp + '/serve/app/**/*.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'liveopsConfigPanel',
        root: 'app'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });

  gulp.task('translations', [], function () {
    return gulp.src(options.lang + '/*.json')
      .pipe($.angularTranslate({
        standalone: false,
        module: 'liveopsConfigPanel'
      }))
      .pipe(gulp.dest(options.tmp + '/partials'));
  });

  gulp.task('html', ['inject', 'partials', 'translations'], function () {
    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var translationsInjectFile = gulp.src(options.tmp + '/partials/translations.js', { read: false });
    var translationsInjectOptions = {
      starttag: '<!-- inject:translations -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var htmlFilter = $.filter(['*.html'], {restore: true});
    var jsFilter = $.filter(['**/*.js'], {restore: true});
    var cssFilter = $.filter(['**/*.css'], {restore: true});

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe($.inject(translationsInjectFile, translationsInjectOptions))
      .pipe($.useref())
      .pipe($.if('*.js', $.rev()))
      .pipe($.if('*.css', $.rev()))
      .pipe($.revReplace())
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }))
      .pipe($.filelog('build'));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src(options.fonts + '/**')
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

  gulp.task('local-soundwave-files', function() {
    gulp.src(options.fonts + '/**')
      .pipe(gulp.dest(options.tmp + '/serve/fonts/'));

    return gulp.src([
        options.soundwaveImages + '/**',
        '!' + options.soundwaveImages + '/liveops-logo.png'
      ])
      .pipe(gulp.dest(options.tmp + '/serve/assets/images/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{html,css,js,scss,hbs}',
      '!' + options.lang,
      '!' + options.lang + '/**'
    ])
    /**
       * The below pipe is usesfull for troubleshooting but 
       * slows down the build process and clogs up the cli
       * when not troubleshooting.
       */
    //.pipe($.debug())
    .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/', 'coverage/'], done);
  });

  gulp.task('vendor-scripts', ['html'], function(){
    return gulp.src(options.dist + '/scripts/vendor-*.js')
      .pipe($.ngAnnotate())
      .pipe($.uglify())
      .pipe(gulp.dest(options.dist + '/scripts/'))
  });

  gulp.task('vendor-styles', ['html'], function(){
    return gulp.src(options.dist + '/styles/vendor-*.css')
      .pipe($.rev())
      .pipe(gulp.dest(options.dist + '/styles/'))
  });

  gulp.task('app-scripts', ['html', 'vendor-scripts'], function(){
    return gulp.src(options.dist + '/scripts/app-*.js')
      .pipe($.ngAnnotate())
      .pipe($.uglify())
      .pipe(gulp.dest(options.dist + '/scripts/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }))
  });

  gulp.task('app-styles', ['html'], function(){
    return gulp.src(options.dist + '/styles/app-*.js')
      .pipe($.rev())
      .pipe(gulp.dest(options.dist + '/styles/'))
  });

  gulp.task('build', ['config', 'html', 'fonts', 'other', 'flags', 'vendor-scripts', 'app-scripts'], function() {
    return gulp.src([
        options.soundwaveImages + '/**',
        '!' + options.soundwaveImages + '/liveops-logo.png'
      ])
      /**
       * The below pipe is usesfull for troubleshooting but 
       * slows down the build process and clogs up the cli
       * when not troubleshooting.
       */
      // .pipe($.debug())
      .pipe(gulp.dest(options.dist + '/assets/images/'));
  });
};
