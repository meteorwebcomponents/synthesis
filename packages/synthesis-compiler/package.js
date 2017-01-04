Package.describe({
  name: 'mwc:synthesis-compiler',
  version: '1.2.1',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('babel-compiler');
  api.use('caching-compiler@1.1.9');
  api.mainModule('synthesis-compiler.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mwc:synthesis-compiler');
  api.mainModule('synthesis-compiler-tests.js');
});

Npm.depends({
  lodash: '4.17.0',
  polyclean: '1.3.1',
  parse5: '2.2.3',
});
