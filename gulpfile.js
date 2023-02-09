import gulp from 'gulp';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import {rollup} from 'rollup';
import * as vite from 'vite'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import * as path from 'path';
import * as url from 'url';
import * as del from 'del';

const DEV_VERSION = '0.0.1';

let scriptFilePath = url.fileURLToPath(import.meta.url);
let scriptDirPath = path.dirname(scriptFilePath);
let srcDirPath = path.resolve(scriptDirPath, 'src');
let distDirPath = path.resolve(scriptDirPath, 'dist');

async function buildCustomElements(outputDirPath){

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
            'process.env': {}
        },
        plugins: [vue({customElement: true}), svgLoader()]
    });

}

async function buildBrowserExtension(browserName, version, fileExtension = 'zip') {
    let outputDirPath = path.join(distDirPath, browserName);

    // --------------
    // icons dir
    await gulp.src(path.join(scriptDirPath, 'icons', '**', '*'))
        .pipe(gulp.dest(path.join(outputDirPath, 'icons')))

    // --------------
    // custom elements
    await gulp.src(path.join(distDirPath, 'custom-elements.js'))
        .pipe(gulp.dest(path.join(outputDirPath)))

    // --------------
    // manifest.json
    let manifestFilename = `manifest.${browserName}.json`;
    await gulp.src(path.join(srcDirPath, manifestFilename))
        .pipe(rename('manifest.json'))
        .pipe(replace('{{EXTENSION_VERSION}}', version))
        .pipe(replace('{{EXTENSION_DESCRIPTION}}', 'description'))
        .pipe(gulp.dest(outputDirPath))

    // --------------
    // content.stackoverflow.js
    let bundle = await rollup({
        input: path.join(srcDirPath, 'content.stackoverflow.js')
    });
    await bundle.write({
        file: path.join(outputDirPath, 'content.stackoverflow.js'),
        format: 'iife',
    })

    // --------------
    // content.npm.js
    bundle = await rollup({
        input: path.join(srcDirPath, 'content.npm.js')
    });
    await bundle.write({
        file: path.join(outputDirPath, 'content.npm.js'),
        format: 'iife',
    })

    // --------------
    // background.js
    bundle = await rollup({
        input: path.join(srcDirPath, 'background.js'),
        plugins: [commonjs(), nodeResolve()],
    });
    await bundle.write({
        file: path.join(outputDirPath, 'background.js'),
        format: 'iife',
    })

    // --------------
    // Zip {browserName}.zip
    await gulp.src(path.join(outputDirPath, '**', '*'))
        .pipe(zip(`${browserName}.${fileExtension}`))
        .pipe(gulp.dest(distDirPath))
}

gulp.task('compile', async () => {
    let version = process.env['BUILD_VERSION'] || DEV_VERSION;
    console.log(`compiling version ${version}`)
    await buildCustomElements(distDirPath)
    await buildBrowserExtension('chrome', version);
    await buildBrowserExtension('firefox', version, "xpi");
});

gulp.task('clean', async () => {
    await del.deleteAsync(distDirPath)
})

gulp.task('build', gulp.series('clean', 'compile'));

gulp.task('watch', function() {
    gulp.watch('./src/**/*', gulp.series('build'));
})

gulp.task('default', gulp.series('build'));
