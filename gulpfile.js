import gulp from 'gulp';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import {rollup} from 'rollup';

import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import * as path from 'path';
import * as url from 'url';
import * as del from 'del';
import * as argparse from 'argparse';

const parser = new argparse.ArgumentParser()
parser.add_argument('-v', '--version', {action: 'version'})
parser.parse_known_args();

const DEFAULT_VERSION = '0.0.2';

let scriptFilePath = url.fileURLToPath(import.meta.url);
let scriptDirPath = path.dirname(scriptFilePath);
let srcDirPath = path.resolve(scriptDirPath, 'src');
let distDirPath = path.resolve(scriptDirPath, 'dist');

async function buildBrowserExtension(browserName, version, fileExtension = 'zip') {
    let outputDirPath = path.join(distDirPath, browserName);

    // --------------
    // icons dir
    await gulp.src(path.join(scriptDirPath, 'icons', '**', '*'))
        .pipe(gulp.dest(path.join(outputDirPath, 'icons')))

    // --------------
    // tooltip.css
    await gulp.src(path.join(srcDirPath, 'tooltip.css'))
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

gulp.task('build', async () => {
    let version = parser.version ?? DEFAULT_VERSION;
    await buildBrowserExtension('chrome', version);
    await buildBrowserExtension('firefox', version, "xpi");
});

gulp.task('clean', async () => {
    await del.deleteAsync(distDirPath)
})
gulp.task('default', gulp.series('clean', 'build'));
