'use strict';

var gulp = require('gulp');
var fs = require('fs');

module.exports = function (options) {
    gulp.task('copy-translation-files', [], function () {
        // The 'translations/translations' folder is a wacky way to fix so translations files are not served on the server root when 
        // running the dev server
        return gulp.src('node_modules/serenova-client-strings/config/*.json')
        .pipe(gulp.dest(options.lang + '/translations'));
    });

    gulp.task('prepare-translations', ['copy-translation-files'], function (done)  {
        var config1Eng = JSON.parse(fs.readFileSync(options.src + '/lang/en.json', 'utf8'));
        var repoEng = JSON.parse(fs.readFileSync(options.lang + '/translations/en-US.json', 'utf8'));
        fs.writeFile(options.lang + '/translations/en-US.json', JSON.stringify(Object.assign(config1Eng, repoEng)), done);
    });
}