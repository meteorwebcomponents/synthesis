var parse5 = Npm.require('parse5');


var throwCompileError = TemplatingTools.throwCompileError;
class PolymerCachingHtmlCompiler extends CachingHtmlCompiler {

  getCacheKey(inputFile) {
    // Note: we include the path for files that are renamed
    return inputFile.getSourceHash();
  }

  compileOneFile(inputFile) {
    const contents = inputFile.getContentsAsString();
    var packagePrefix = '';

    if (inputFile.getPackageName()) {
      packagePrefix += '/packages/' + inputFile.getPackageName() + '/';
    }

    const inputPath = packagePrefix + inputFile.getPathInPackage();
    try {
      const tags = this.tagScannerFunc({
        sourceName: inputPath,
        contents: contents
      });
      return this.tagHandlerFunc(tags);
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
function  addBodyAttrs(attrs,results,TemplatingTools) {
  Object.keys(attrs).forEach(function(attr) {
    const val = attrs[attr];
    if (results.bodyAttrs.hasOwnProperty(attr) && results.bodyAttrs[attr] !== val) {
      throwCompileError(
        `<body> declarations have conflicting values for the '${attr}' attribute.`);
    }

    results.bodyAttrs[attr] = val;
  });
  return results;
}

parseHtml = function(arg){
  var contents = arg.contents
  var parseOptions = {locationInfo:true}
  var parsed = parse5.parse(contents);
  return parsed;
}
var dissectHtml = function(document){
  var dissected = {head:"",body:"",js:"console.log('ready')"};
  //tags.forEach(function(tag){
  ////console.log(tag.tagName);
  //});
  //var head = document.childNodes[0].childNodes[0];
  //var body = document.childNodes[0].childNodes[1];

  document.childNodes.forEach(function(child){
    if(child.nodeName==="#documentType"){
      throwCompileError("Can't set DOCTYPE here.  (Meteor sets <!DOCTYPE html> for you)");
    }
    else if(child.nodeName ==="html"){
      child.childNodes.forEach(function(child){
        if(child.nodeName === "head"){
          dissected.head += parse5.serialize(child);
        }
        else if(child.nodeName==="body"){
          var body = child;
          body.childNodes = _.filter(body.childNodes,function(child){
            if(child.nodeName === "script"){
              dissected.js += parse5.serialize(child)
            }
            else{
              return child;
            }
          });

          dissected.body += parse5.serialize(body);
        }
      });
    }
  });

  return dissected;
}
Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: false
}, () => new PolymerCachingHtmlCompiler("polymer", parseHtml, dissectHtml));


