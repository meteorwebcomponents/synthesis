Package.describe({
  name: 'mwc:synthesis',
  version: '1.3.4',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.addFiles('synthesis-client.js', 'client');
  api.export('Synthesis', ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mwc:synthesis');
  api.mainModule('synthesis-tests.js');
});


Package.registerBuildPlugin({
  name: 'synthesis',
  use: [
    'mwc:synthesis-compiler@1.3.2',
    'caching-html-compiler@1.0.7',
    'ecmascript@0.4.1',
  ],
  sources: [
    'plugin/synthesis.js',
  ],
});
