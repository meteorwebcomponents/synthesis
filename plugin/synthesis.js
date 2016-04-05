Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: true
}, () => new PolymerCachingHtmlCompiler("synthesis", parseHtml, dissectHtml));


var parse5 = Npm.require('parse5');
var fs = Npm.require('fs');
var path = Npm.require('path');
var Future = Npm.require('fibers/future');
var Minimize = Npm.require('minimize');
var minimize = new Minimize({
  empty: true,  
  comments: true,
  ssi: true,
  conditionals: true,
  spare: true,
  dom: {
    xmlMode: false
  }

});
var throwCompileError = TemplatingTools.throwCompileError;

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

parseHtml = function(arg){
  var contents = arg.contents
  var parseOptions = {locationInfo:true}
  var parsed = parse5.parse(contents);
  //console.log(arg.sourceName);
  const tag = {
    tagName: "template",
    attribs: {
      id : arg.sourceName
    },
    contents: parsed,
    fileContents: arg.contents,
    sourceName: arg.sourceName
  };
  return tag;
}
var dissectHtml = function(tag){
  var document = tag.contents;
  var dissected = {head:"",body:"",js:"",bodyAttrs:{}};
  var sourceName = tag.sourceName;
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
          body.attrs.forEach(function(attr) {
            if (dissected.bodyAttrs.hasOwnProperty(attr.name) && dissected.bodyAttrs[attr.name] !== attr.value) {
              throwCompileError(
                `<body> declarations have conflicting values for the '${attr.name}' attribute.`);
            }

            dissected.bodyAttrs[attr.name] = attr.value;
          });
          body.childNodes = processChildNodes(body.childNodes);
          function processChildNodes(childNodes){
            return _.filter(childNodes,function(child){
              if(child.nodeName === "script"){
                dissected.js += parse5.serialize(child)
              }
              else if(child.nodeName == "template"){
                var isWalkable = child.content &&child.content.nodeName == "#document-fragment" && child.content.childNodes;
                if(isWalkable){
                  child.content.childNodes = processChildNodes(child.content.childNodes);
                }
                return child;
              }
              else if(child.nodeName == "style"){

                var source = parse5.serialize(child);
                if(child.childNodes){
                  child.childNodes = child.childNodes.map(function(child){
                    if(child.nodeName == "#text"){
                      child.value = child.value.replace(/\r?\n|\r/g, "");
                    }
                    return child;
                  });
                }
                return child;
              }
              else if(child.nodeName == "link"){
                if(attrs){
                  var ifImport = _.find(attrs, function(v){

                    return (v.name == "rel" && v.value == "import")

                  });
                  if(ifImport){
                    var hrefAttr = _.find(attrs, function(v){

                      return v.name == "href";

                    });
                    if(hrefAttr){
                      if(hrefAttr.value){
                        var url = path.resolve(sourceName,hrefAttr.value);
                        // vulcanize this url and run dissectHtml for the output
                        return child; // remove this after adding vulcanize
                      }
                      else{
                        throwCompileError("link import href is blank");

                      }
                    }
                    else{
                      throwCompileError("No href for link import");
                    }
                  }
                  else{
                    return child;
                  }
                }
                else{
                  return child;
                }
              }
              else if(child.childNodes && child.childNodes.length){
                child.childNodes = processChildNodes(child.childNodes);
                return child;
              }
              else{
                return child;
              }
            });           


          } 
          var bodyContents = minimizeHtml(parse5.serialize(body));
          if(sourceName.match(/^client/)){
            dissected.body += bodyContents;
          }
          else{
            dissected.js += Synthesis.generateJS(bodyContents);
          }
        }
      });
    }
  });

  return dissected;
}



var minimizeHtml = function(html) {
  var future = new Future();
  minimize.parse(
    html,
    function (error, data) {
      if(error){
        future.throw(error);
      }
      future.return(data);
    }
  );
  return future.wait();

};


