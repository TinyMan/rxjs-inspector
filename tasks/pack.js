const path = require('path');
const gulp = require('gulp');
const zip = require('gulp-zip');
const log = require('fancy-log');
const colors = require('ansi-colors');
const filter = require('gulp-filter');
const jsonTransform = require('gulp-json-transform');

const projectRoot = path.resolve(__dirname, '..');
const extensionRoot = path.resolve(projectRoot, 'packages/extension');
const packageDetails = require(path.resolve(extensionRoot, 'package.json'));

gulp.task('pack', () => {
  const version = packageDetails.version;
  const filename = `rxjs-inspector-devtools-${version}.zip`;
  const f = filter(file => file.relative === 'manifest.json', {
    restore: true,
  });
  return gulp
    .src(`${extensionRoot}/lib/**/*`)
    .pipe(f)
    .pipe(
      jsonTransform(function(data, file) {
        return { ...data, key: undefined };
      }, 2)
    )
    .pipe(f.restore)
    .pipe(zip(filename))
    .pipe(gulp.dest('./lib'))
    .on('end', () => {
      let distStyled = colors.magenta(`${extensionRoot}`);
      let filenameStyled = colors.magenta(`${extensionRoot}/lib/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    })
    .on('error', e => {
      console.error(e);
    });
});
