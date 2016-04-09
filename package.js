Package.describe({
  name: 'mwc:synthesis',
  version: '1.0.12',
  summary: 'Synthesis is meteor + polymer',
  git: 'https://github.com/meteorwebcomponents/synthesis',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use("isobuild:compiler-plugin@1.0.0");
  api.addFiles('synthesis.js',['client']);
  api.addFiles('synthesizer-browser.js',['web.browser']);
  api.addFiles('synthesizer-cordova.js',['web.cordova']);
  api.export('Synthesis',["client"]);
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
    'underscore@1.0.6',
    'html-tools@1.0.7'
  ],
  sources: [
    'plugin/comment-map.js',
    'plugin/constants.js',
    'plugin/matchers.js',
    'plugin/output.js',
    'plugin/pathresolver.js',
    'plugin/vulcan.js',
    'plugin/synthesizer.js',
    'plugin/synthesis.js'

  ],
  npmDependencies: {
    'minimize':"1.8.1",
    "dom5": "1.3.1",
    "es6-promise": "2.1.0",
    "hydrolysis": "1.19.1",
    "nopt": "3.0.1",
    "path-posix": "1.0.0",
    'parse5': '2.1.5'
  }
});
