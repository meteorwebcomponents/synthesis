Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: true
}, function(){
  return new PolymerCachingHtmlCompiler("synthesis", parseHtml, handleTags);
});


var parse5 = Npm.require('parse5');
var fs = Npm.require('fs');
var path = Npm.require('path');
var Future = Npm.require('fibers/future');
var _ = Npm.require('lodash');

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
    if(inputPath.match(/\/(demo|test|docs).*\//) && !process.env.FORCESYNTHESIS){
      return null;
    }
    try {
      const tags = this.tagScannerFunc({
        sourceName: inputPath,
        contents: contents
      });
      var result = this.tagHandlerFunc(tags);
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

parseHtml = function(arg){
  var contents = arg.contents
  var parseOptions = {}
  var parsed = parse5.parse(contents);
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
function handleTags(tags) {
  var handler = new dissectHtml();
  handler.dissect(tags);
  return handler.dissected;
}

class dissectHtml {
  constructor() {
    this.dissected = {
      head: '',
      body: '',
      js: '//*synthesis*//\n\n',
      tailJs:'',
      bodyAttrs: {}
    };
  }
  dissect(tag){
    this.document = tag.contents;
    this.sourceName = tag.sourceName;
    const self = this;
    const children = this.document.childNodes || [];
    for(i=0;i<children.length;i++){
      const child = children[i];
      switch(child.nodeName){
        case "#documentType":
          break;
        case "html":
          const _children = child.childNodes || [];
        for(_i=0;_i<_children.length;_i++){
          _child = _children[_i];
          switch(_child.nodeName){
            case "head":
              _child.childNodes = _.compact(_.map(_child.childNodes,(__child) => {
              switch (__child.nodeName){
                case "link":
                  __child = self.processLinks(__child);
                if(__child){
                  return __child;
                }
                break;
                case "script":
                  var result = self.processScripts(__child);
                if(result){
                  return result;
                }
                break;
                default:
                  return __child;
                break;

              } 
            }));
            const headContents =parse5.serialize(_child);
            self.dissected.js += "\n\n"+Synthesizer.generateJS(headContents,true) +"\n\n";
            break;
            case "body":
              const body = _child;
            body.attrs.forEach((attr) => {
              if (self.dissected.bodyAttrs.hasOwnProperty(attr.name) && self.dissected.bodyAttrs[attr.name] !== attr.value) {
              }
              else{
                self.dissected.bodyAttrs[attr.name] = attr.value;
              }
            });
            delete body.attrs;
            body.childNodes = self.processChildNodes(body.childNodes);
            const bodyContents = parse5.serialize(body);
            self.dissected.js += "\n\n"+Synthesizer.generateJS(bodyContents) +"\n\n";
            break;
          }
        };
        break;
      }
    };
    this.dissected.js += "\n\n"+this.dissected.tailJs+"\n\n";

  }
  processChildNodes(childNodes){
    const self = this;
    return _.compact(_.map(childNodes,(child) => {
      switch (child.nodeName) {
        case "template":
          const isWalkable = child.content &&child.content.nodeName == "#document-fragment" && child.content.childNodes;
        if(isWalkable){
          child.content.childNodes = self.processChildNodes(child.content.childNodes);
        }
        return child;
        break;
        case "link":
          child = self.processLinks(child);
        if(child){
          return child;
        }
        break;
        case "script":
          var result = self.processScripts(child);
        if(result){
          return result;
        }
        break;
        case "dom-module":
          if(child.childNodes){
          child.childNodes = self.processChildNodes(child.childNodes);
        }
        return child;
        break;

        default:
          return child;
        break;
      }
    }));           


  } 
  processScripts(child){
    const self = this;
    const importSource = _.find(child.attrs, (v) => {
      return (v.name == "src");
    });
    if(importSource && importSource.value){
      const importableUrl = self.importableUrl(importSource.value);
      if(!importableUrl){
        return child;
      }
      else{
        self.dissected.tailJs +=  `\n\nrequire('${importableUrl}');\n\n`;
      }
    }
    else{

      self.dissected.tailJs += "\n\n"+parse5.serialize(child)+"\n\n";
    }

  }

  importableUrl (url){
    if(url.match(/^(\/|https?:\/)/)){
      return false;
    }
    return url.match(/^(\.\/|\.\.\/)/) ? url : './'+url;
  }
  processLinks(child){
    var self = this;
    if(child.attrs){
      const supportedRels = ["import","stylesheet"];
      const ifImport = _.find(child.attrs, (v) => {
        return (v.name == "rel" && supportedRels.indexOf(v.value) > -1)
      });
      if(ifImport){
        const hrefAttr = _.find(child.attrs, (v) => {
          return v.name == "href";
        });
        if(hrefAttr){
          if(hrefAttr.value){
            const url = self.importableUrl(hrefAttr.value);
            if(!url){
              return child;
            }
            else{
              switch(ifImport.value){
                case "import":
                  const link = `require('${url}');`;
                self.dissected.tailJs += "\n\n"+link+"\n\n";

                break;
                case "stylesheet":
                  const url = path.resolve(self.sourceName,'../',hrefAttr.value);
                if(fs.existsSync(url)){
                  const contents = fs.readFileSync(url,"utf8");
                  const minified = contents.replace(/\r?\n|\r/g, "");
                  if(minified){
                    child = _.extend(child,{
                      nodeName:"style",
                      tagName:"style",
                      attrs:[],
                      childNodes:[
                        {nodeName:"#text",
                          value:minified
                        }
                      ]
                    });
                    return child;
                  }

                }
                return child;

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

  }

}


