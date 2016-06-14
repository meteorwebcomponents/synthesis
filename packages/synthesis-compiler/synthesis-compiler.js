import { Synthesizer } from './synthesis-gen.js';
const parse5 = Npm.require('parse5');
const polyclean = Npm.require('polyclean');
const fs = Npm.require('fs');
const path = Npm.require('path');
const Future = Npm.require('fibers/future');
const _ = Npm.require('lodash');

export const parseHtml = (arg)=>{
  const contents = arg.contents
  const parseOptions = {}
  const parsed = parse5.parse(contents);
  //parsed is a json object
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
export const handleTags = (tags)=> {
  const handler = new dissectHtml();
  handler.dissect(tags);
  return handler.dissected;
}

class dissectHtml {
  constructor() {
    this.dissected = {
      head: '',
      body: '',
      js: '//*synthesis*//\n\n',
      tailJs:'', //tailJs is appened last
      bodyAttrs: {}
    };
  }
  dissect(tag){
    this.document = tag.contents;
    this.sourceName = tag.sourceName;
    const self = this;
    const children = this.document.childNodes || [];
    for(let i=0;i<children.length;i++){
      const child = children[i];
      switch(child.nodeName){
        case "#documentType":
          break;
        case "#comment":
          break;
        case "html":
          const _children = child.childNodes || [];
        for(let _i=0;_i<_children.length;_i++){
          _child = _children[_i];
          switch(_child.nodeName){
            case "head":
              _child.childNodes = self.processChildNodes(_child.childNodes);
            const headContents =parse5.serialize(_child);
            //for files inside client folder html contents can be directly added to dissected.html
            if(self.sourceName.match(/^client\//)){
              self.dissected.head += headContents;
            }
            else{

              self.dissected.js += "\n\n"+Synthesizer.generateJS(headContents,true) +"\n\n";
            }
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
            if(self.sourceName.match(/^client\//)){
              self.dissected.body += bodyContents;
            }
            else{
              self.dissected.js += "\n\n"+Synthesizer.generateJS(bodyContents) +"\n\n";
            }
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
    let pushNodes = []
    let processedNodes =  _.compact(_.map(childNodes,(child) => {
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
          const result = self.processScripts(child);
        if(result){
          return result;
        }
        break;
        case "style":
          if(child.childNodes && child.childNodes.length){
          const css = child.childNodes[0].value;
          const result = self.processStyle(css);
          if(result){
            child.childNodes[0].value = result;
          }
        }
        return child;

        break;
        case "dom-module":
          if(child.childNodes){
          child.childNodes = self.processChildNodes(child.childNodes);
        }
        return child;
        break;
        case "div":
          const attrs = _.filter(child.attrs, function(o) { return (o.name == "hidden" || o.name =="by-vulcanize"); });
        if(attrs.length >= 2){
          const _childNodes = self.processChildNodes(child.childNodes);
          pushNodes = pushNodes.concat(_childNodes);
        }
        else{
          return child;
        }
        break;
        case "#comment":
          break;
        default:
          return child;
        break;
      }
    }));           
    return processedNodes.concat(pushNodes);

  } 
  processStyle(css){
    return polyclean.stripCss(css);
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
    const self = this;
    //<link rel="import"...> and <link rel="stylesheet"...>
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
          switch(ifImport.value){
            case "import":
              //file is imported using require
              const url = self.importableUrl(hrefAttr.value);
            if(!url){
              return child;
            }
            const typeAttr = _.find(child.attrs, (v) => {
              return (v.name == "type");
            });

            if(typeAttr){
              switch(typeAttr.value){
                case "css":
                  return self.processCssImport(hrefAttr,child);
                break;
              }

            }
            const link = `require('${url}');`;
            self.dissected.tailJs += "\n\n"+link+"\n\n";

            break;
            //Processing <link rel="stylesheet" href="filename.css">
            case "stylesheet":
              //absolute file path
              return self.processCssImport(hrefAttr,child);
            break;

          }
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
  processCssImport(hrefAttr,child){
    const url = path.resolve(this.sourceName,'../',hrefAttr.value);
    //checks if file exists
    if(fs.existsSync(url)){
      const contents = fs.readFileSync(url,"utf8");
      //css is inlined
      const minified = this.processStyle(contents);
      if(minified){
        //link tag is replaced with style tag
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


  }

}


export const name = 'synthesis-compiler';
