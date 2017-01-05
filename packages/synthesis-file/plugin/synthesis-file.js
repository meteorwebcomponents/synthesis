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

const extensions = ['png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff', 'svg'];
Plugin.registerCompiler({
  extensions,
  archMatching: 'web',
}, function(){
  return new SynthesisFileCompiler();
});
