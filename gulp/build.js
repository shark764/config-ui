'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
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

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe($.inject(translationsInjectFile, translationsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      // .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore())
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
    .pipe($.debug())
      .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/', 'coverage/'], done);
  });

  gulp.task('build', ['config', 'html', 'fonts', 'other'], function() {
    return gulp.src([
        options.soundwaveImages + '/**',
        '!' + options.soundwaveImages + '/liveops-logo.png'
      ])
      .pipe($.debug())
      .pipe(gulp.dest(options.dist + '/assets/images/'));
  });
};
