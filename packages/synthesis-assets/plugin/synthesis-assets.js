function SynthesisFileCompiler() {}
SynthesisFileCompiler.prototype.processFilesForTarget = function (files) {
  files.forEach(function (file) {
    let packagePrefix = '';
    if (file.getPackageName()) {
      packagePrefix += `/packages/${file.getPackageName()}/`;
    }

    const filePath = packagePrefix + file.getPathInPackage();
    const content = file.getContentsAsBuffer();

    file.addAsset({
      path: filePath,
      data: content
    });
  });
};

const img = ['png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff', 'svg'];
const font = ['ttf', 'woff', 'eot', 'otf', 'woff2'];
const extensions = [...img, ...font];

Plugin.registerCompiler({
  extensions,
  archMatching: 'web',
}, function(){
  return new SynthesisFileCompiler();
});
