import { parseHtml , handleTags } from 'meteor/mwc:synthesis-compiler';

Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: true
}, ()=>{
  return new PolymerCachingHtmlCompiler("synthesis", parseHtml, handleTags);
});

const throwCompileError = TemplatingTools.throwCompileError;

class PolymerCachingHtmlCompiler extends CachingHtmlCompiler {

  getCacheKey(inputFile) {
    return [
      inputFile.getPackageName(),
      inputFile.getPathInPackage(),
      inputFile.getSourceHash()
    ];
  }

  compileOneFile(inputFile) {
    const contents = inputFile.getContentsAsString();
    let packagePrefix = '';

    if (inputFile.getPackageName()) {
      packagePrefix += '/packages/' + inputFile.getPackageName() + '/';
    }

    const inputPath = packagePrefix + inputFile.getPathInPackage();
    //files inside folders with names demo/test/docs are skipped.
    if(inputPath.match(/\/(demo|test|docs).*\//) && !process.env.FORCESYNTHESIS){
      return null;
    }
    try {
      const tags = this.tagScannerFunc({
        sourceName: inputPath,
        contents: contents
      });
      const result = this.tagHandlerFunc(tags);
      return result;
    } catch (e) {
      if (e instanceof TemplatingTools.CompileError) {
        inputFile.error({
          message: e.message,
          line: e.line
        });
        return null;
      } else {
        throw e;
      }
    }
  }

};

