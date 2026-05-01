import { createAppConfig, createTestsBundleConfig } from '../../scripts/rollup.app.mjs';

const engineConfig = createAppConfig({ outputFile: 'dist/cocos2d.min.js' });

const appConfig = createTestsBundleConfig({
  input: 'src/index.js',
  outputFile: 'dist/app.min.js'
});

export default [engineConfig, appConfig];
