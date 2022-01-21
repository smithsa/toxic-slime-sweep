const gulp = require('gulp');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const webpackConfig = require('./webpack.prod.js');
const imagemin = require('gulp-imagemin');
const audiosprite = require('audiosprite');
const fs = require("fs");

function bundleJavascriptViaWebpack () {
  return gulp.src('src/js/index.js')
    .pipe(
      gulpWebpack(webpackConfig, webpack)
    )
    .pipe(gulp.dest('dist/'));
}
gulp.task("bundleJavascriptViaWebpack", bundleJavascriptViaWebpack);

function createAudioSprites(inputFile) {
  return new Promise(function(resolve, reject) {
    try {
      checkFileExists(inputFile).then((exists) => {
        if(exists) {
          let outputPath = inputFile.replace('src', 'dist')
          createAudioSpritesFiles(inputFile, `${outputPath}/audio_sprite`);
        } else {
          console.error(`${inputFile} does not exist`);
        }
      })

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

gulp.task("createAudioSpritesSound", createAudioSprites('./src/sounds'));

function createAudioSpritesFiles(sourcePath, outputPath) {
  let files = [];

  fs.readdirSync(sourcePath).forEach(file => {
    let filePath = `${sourcePath}/${file}`;

    if(file.match(/(webm|m4a|mp3|wav|ogg|ac3)/)) {
      files.push(filePath)
    }
  });

  let opts = {output: `${outputPath}`};
  audiosprite(files, opts, function(err, obj) {
    if (err) return console.error(err);

    fs.writeFile(`${outputPath}.json`, JSON.stringify(obj, null, 2), () => {
      console.log(`Audio sprite files generated with ${outputPath}.json file`);
    })
  })
}

function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

gulp.task('default', gulp.series("bundleJavascriptViaWebpack", "createAudioSpritesSound", "createAudioSpritesVoice"));
