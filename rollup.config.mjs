import terser from '@rollup/plugin-terser';
import concatPlugin from './scripts/rollup-plugin-concat.mjs';
import { getFullBuildFiles, getCoreBuildFiles } from './scripts/resolve-modules.mjs';

const VERSION = '3.15';

function makeConfig(name, files, outputFile) {
  return {
    input: 'concat-entry',
    plugins: [
      concatPlugin(files),
      terser({
        ecma: 5,
        module: false,
        compress: {
          dead_code: true,
          drop_console: false,
          passes: 2
        },
        mangle: {
          reserved: ['cc', 'gl', 'WebGLRenderingContext']
        },
        format: {
          comments: false
        }
      })
    ],
    output: {
      file: outputFile,
      format: 'es',
      strict: false,
      sourcemap: true,
      sourcemapFile: outputFile.replace(/-min\.js$/, '-sourcemap')
    }
  };
}

const buildType = process.env.BUILD;

const fullConfig = makeConfig(
  'full',
  getFullBuildFiles(),
  `lib/cocos2d-js-v${VERSION}-min.js`
);

const coreConfig = makeConfig(
  'core',
  getCoreBuildFiles(),
  `lib/cocos2d-js-v${VERSION}-core-min.js`
);

let configs;
if (buildType === 'full') {
  configs = [fullConfig];
} else if (buildType === 'core') {
  configs = [coreConfig];
} else {
  configs = [fullConfig, coreConfig];
}

export default configs;
