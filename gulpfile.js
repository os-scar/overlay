import gulp from 'gulp';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import rename from 'gulp-rename';

import { rollup } from 'rollup';
import * as vite from 'vite';
import svgLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';
import { promises as fs } from 'fs';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import * as path from 'path';
import * as url from 'url';
import * as del from 'del';

const DEV_VERSION = '0.0.1';
const FILE_EXTENSION_ZIP = 'zip';
const FILE_EXTENSION_XPI = 'xpi';

const BROWSER_TYPE_CHROME = 'chrome';
const BROWSER_TYPE_FIREFOX = 'firefox';

const scriptFilePath = url.fileURLToPath(import.meta.url);
const scriptDirPath = path.dirname(scriptFilePath);
const srcDirPath = path.resolve(scriptDirPath, 'src');
const distDirPath = path.resolve(scriptDirPath, 'dist');

async function buildCustomElements(outputDirPath) {
  await vite.build({
    build: {
      emptyOutDir: false,
      outDir: outputDirPath,
      lib: {
        entry: path.join(srcDirPath, 'custom-elements', 'index.js'),
        name: 'custom-elements',
        formats: ['es'],
        fileName: 'custom-elements',
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    plugins: [vue({ customElement: true }), svgLoader()],
  });

  // --------------
  // Recompile without customElement: true to extract css
  let results = await vite.build({
    build: {
      emptyOutDir: false,
      write: false,
      lib: {
        entry: path.join(srcDirPath, 'custom-elements', 'index.js'),
        name: 'custom-elements',
        fileName: 'custom-elements',
      },
    },
    plugins: [vue(), svgLoader()],
  });

  let customElementsCssOutputFilePath = path.join(distDirPath, 'custom-elements.css');

  let files = results[0].output;
  for (const file of files) {
    if (file.name !== 'style.css') {
      continue;
    }
    let cssFileContent = file.source;
    await fs.writeFile(customElementsCssOutputFilePath, cssFileContent, 'utf8');
  }
}

async function buildBrowserExtension(browserType, version, fileExtension) {
  let outputDirPath = path.join(distDirPath, browserType);

  // --------------
  // icons dir
  await gulp.src(path.join(scriptDirPath, 'icons', '**', '*')).pipe(gulp.dest(path.join(outputDirPath, 'icons')));

  // --------------
  // custom-elements.js + css
  await gulp.src(path.join(distDirPath, 'custom-elements.js')).pipe(gulp.dest(path.join(outputDirPath)));
  await gulp.src(path.join(distDirPath, 'custom-elements.css')).pipe(gulp.dest(path.join(outputDirPath)));

  // --------------
  // manifest.json
  let manifestFilename = `manifest.${browserType}.json`;
  await gulp
    .src(path.join(srcDirPath, manifestFilename))
    .pipe(rename('manifest.json'))
    .pipe(replace('{{EXTENSION_VERSION}}', version))
    .pipe(replace('{{EXTENSION_DESCRIPTION}}', 'description'))
    .pipe(gulp.dest(outputDirPath));

  // --------------
  // content.stackoverflow.js
  let bundle = await rollup({
    input: path.join(srcDirPath, 'content.stackoverflow.js'),
  });
  await bundle.write({
    file: path.join(outputDirPath, 'content.stackoverflow.js'),
    format: 'iife',
  });

  // --------------
  // background.js
  bundle = await rollup({
    input: path.join(srcDirPath, 'background.js'),
    plugins: [commonjs(), nodeResolve()],
  });
  await bundle.write({
    file: path.join(outputDirPath, 'background.js'),
    format: 'iife',
  });

  // --------------
  // Zip {browserName}.zip
  await gulp
    .src(path.join(outputDirPath, '**', '*'))
    .pipe(zip(`${browserType}_${version}.${fileExtension}`))
    .pipe(gulp.dest(distDirPath));
}

gulp.task('compile', async () => {
  let version = process.env['BUILD_VERSION'] || DEV_VERSION;
  console.log(`compiling version ${version}`);

  await buildCustomElements(distDirPath);
  await buildBrowserExtension(BROWSER_TYPE_CHROME, version, FILE_EXTENSION_ZIP);
  await buildBrowserExtension(BROWSER_TYPE_FIREFOX, version, FILE_EXTENSION_XPI);
});

gulp.task('clean', async () => {
  await del.deleteAsync(distDirPath);
});

gulp.task('build', gulp.series('clean', 'compile'));

gulp.task('watch', function () {
  gulp.watch('./src/**/*', gulp.series('build'));
});

gulp.task('default', gulp.series('build'));
