Package.describe({
  name: 'mwc:synthesis-compiler',
  version: '1.0.27',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('caching-compiler@1.0.0');
  api.use('html-tools@1.0.7');

  api.mainModule('synthesis-compiler.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mwc:synthesis-compiler');
  api.mainModule('synthesis-compiler-tests.js');
});

Npm.depends({
  'cheerio': '0.20.0',
  'html-minifier': '0.8.0'
})
