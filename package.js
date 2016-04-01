Package.describe({
  name: 'mwc:synthesis',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use("isobuild:compiler-plugin@1.0.0");
  //api.addFiles('polymer.js',["client"]);
  //api.addFiles('webcomponents-lite.min.js',["client"]);
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
    'caching-html-compiler',
    'ecmascript',
    'templating-tools',
    'underscore',
    'html-tools'
  ],
  sources: ['plugin/synthesis.js'],
  npmDependencies: {
    'parse5': '2.1.5'
  }
});
