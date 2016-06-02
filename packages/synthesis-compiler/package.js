Package.describe({
  name: 'mwc:synthesis-compiler',
  version: '1.0.26',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.mainModule('synthesis-compiler.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mwc:synthesis-compiler');
  api.mainModule('synthesis-compiler-tests.js');
});

Npm.depends({
  'lodash':'4.11.1',
  'parse5': '2.1.5'
})
