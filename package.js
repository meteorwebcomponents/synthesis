Package.describe({
  name: 'mwc:synthesis',
  version: '1.0.3',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use("isobuild:compiler-plugin@1.0.0");
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
    'underscore@1.0.6',
    'html-tools@1.0.7'
  ],
  sources: ['plugin/synthesis.js'],
  npmDependencies: {
    'parse5': '2.1.5'
  }
});
