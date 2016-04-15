Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: true
}, function(){
  return new PolymerCachingHtmlCompiler("synthesis", parseHtml, dissectHtml);
});


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

var vulcanize = new Vulcanize({
  stripExcludes: [
    'polymer\.html$'
  ],
  inlineScripts: true,
  inlineCss: true,
  implicitStrip: true,
  stripComments: true
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
  var parseOptions = {}
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
      throwCompileError("Can't set DOCTYPE here.  (Meteor sets DOCTYPE html for you)");
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
                `body declarations have conflicting values for the '${attr.name}' attribute.`);
            }

            dissected.bodyAttrs[attr.name] = attr.value;
          });
          body.childNodes = processChildNodes(body.childNodes);
          function processChildNodes(childNodes){
            return _.compact(_.map(childNodes,function(child){
              switch (child.nodeName) {
                case "script":
                  dissected.js += parse5.serialize(child)
                break;
                case "template":
                  var isWalkable = child.content &&child.content.nodeName == "#document-fragment" && child.content.childNodes;
                if(isWalkable){
                  child.content.childNodes = processChildNodes(child.content.childNodes);
                }
                return child;
                break;
                case "style":

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
                break;
                case "link":
                  if(child.attrs){
                  var supportedRels = ["import","stylesheet"];
                  var ifImport = _.find(child.attrs, function(v){
                    return (v.name == "rel" && supportedRels.indexOf(v.value) > -1)

                  });
                  if(ifImport){
                    var hrefAttr = _.find(child.attrs, function(v){

                      return v.name == "href";

                    });
                    if(hrefAttr){
                      if(hrefAttr.value){
                        var inValidUrl = sourceName.match(/^(https?:\/\/)|(^\/)/); 
                        if(inValidUrl){
                          return child;
                        }
                        else{

                          var url = path.resolve(sourceName,'../',hrefAttr.value);
                          // vulcanize this url and run dissectHtml for the output
                          switch(ifImport.value){
                            case "import":
                              if(!url.match(/polymer\.html$/)){
                              const vulcanized = vulcanizeImports(url);
                              if(vulcanized){
                                const fileTag = {
                                  contents: vulcanized,
                                  sourceName: url
                                };

                                var result = dissectHtml(parseHtml(fileTag));

                                dissected.head += result.head;
                                dissected.body += result.body;
                                dissected.js += result.js;

                              }
                            }

                            break;
                            case "stylesheet":
                              var contents = fs.readFileSync(url,"utf8");
                            contents = contents.replace(/\r?\n|\r/g, "");
                            if(contents){
                              child = _.extend(child,{
                                nodeName:"style",
                                tagName:"style",
                                childNodes:[
                                  {nodeName:"#text",
                                    value:contents
                                  }
                                ]
                              });
                              return child;
                            }


                            break;

                          }
                        }
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
                break;
                default:
                  if(child.childNodes && child.childNodes.length){
                  child.childNodes = processChildNodes(child.childNodes);
                  return child;
                }
                else{
                  return child;
                }
              }
            }));           


          } 
          var bodyContents = minimizeHtml(parse5.serialize(body));
          if(sourceName.match(/^client/)){
            dissected.body += bodyContents;
          }
          else{
            dissected.js += Synthesizer.generateJS(bodyContents);
          }
        }
      });
    }
  });

  return dissected;
}


var vulcanizeImports = function(link) {
  var future = new Future();
  vulcanize.process(link, function(err, html) {
    //if (_.isString(process.env.vulcanized)) {
    //filePath = url.resolve(process.env.CDN_PREFIX, filePath);
    //}
    if(err){
      //throwCompileError(err);
      console.log(err);
    }

    future.return(html);
  });

  return future.wait();
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

