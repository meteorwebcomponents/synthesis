Package.describe({
  name: 'mwc:synthesis',
  version: '1.0.18',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use("isobuild:compiler-plugin@1.0.0");
  api.addFiles('synthesizer-browser.js',['web.browser']);
  api.addFiles('synthesizer-cordova.js',['web.cordova']);
  api.export('Synthesizer',["client"]);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mwc:synthesis');
  api.mainModule('synthesis-tests.js');
});


Package.registerBuildPlugin({
  name: 'synthesis',
  use: [
    'caching-html-compiler@1.0.2',
    'ecmascript@0.4.1',
    'templating-tools@1.0.2',
    'html-tools@1.0.7'
  ],
  sources: [
    'plugin/synthesizer.js',
    'plugin/synthesis.js'

  ],
  npmDependencies: {
    'lodash':'4.11.1',
    'parse5': '2.1.5'
  }
});
