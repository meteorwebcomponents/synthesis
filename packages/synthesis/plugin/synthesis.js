import { parseHtml, handleTags } from 'meteor/mwc:synthesis-compiler';
import { CachingHtmlCompiler } from 'meteor/caching-html-compiler';

class PolymerCachingHtmlCompiler extends CachingHtmlCompiler {

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  compileOneFile(inputFile) {
    const contents = inputFile.getContentsAsString();
    let packagePrefix = '';
    if (inputFile.getPackageName()) {
      packagePrefix += `/packages/${inputFile.getPackageName()}/`;
    }
    const inputPath = packagePrefix + inputFile.getPathInPackage();
    // files inside folders with names demo/test/docs are skipped.
    if (inputPath.match(/\/(demo|test|docs).*\//) && !process.env.FORCESYNTHESIS) {
      return null;
    }
    try {
      const tags = this.tagScannerFunc({
        sourceName: inputPath,
        contents,
      });
      const result = this.tagHandlerFunc(tags);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

Plugin.registerCompiler({
  extensions: ['html', 'htm'],
  archMatching: 'web',
  isTemplate: true,
}, () => new PolymerCachingHtmlCompiler('synthesis', parseHtml, handleTags));
