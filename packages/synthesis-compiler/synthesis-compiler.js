// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See synthesis-compiler-tests.js for an example of importing.

import { Synthesizer } from './synthesis-gen.js';
const fs = Npm.require('fs');
const path = Npm.require('path');
const Future = Npm.require('fibers/future');

const cheerio = require('cheerio');
const htmlMinifier = require('html-minifier');

export const parseHtml = (arg)=>{
  const contents = arg.contents.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/gi, '');
  const parseOptions = {}
  //parsed is a json object
  const tag = {
    tagName: "template",
    attribs: {
      id : arg.sourceName
    },
    contents:contents,
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
    this.contents = tag.contents;
    const $ = cheerio.load(this.contents);
    this.sourceName = tag.sourceName;
    const self = this;
    const imports = $('link[rel="import"]');
    const scripts = $('script');
    const cssImport = $('link[rel="stylesheet"]');
    imports.each(function(){
      const filePath = $(this).attr('href');
      if(filePath){
        self.dissected.tailJs += `\nrequire("${self.importableUrl(filePath)}");\n`;
        $(this).remove();
      }
    });
    cssImport.each(function(){

      const filePath = $(this).attr('href');
      if(filePath){
        const url = path.resolve(self.sourceName,'../',filePath);
        //checks if file exists
        if(fs.existsSync(url)){
          const css = fs.readFileSync(url,"utf8");
          const newTag = $(`<style>${css}</style>`);
          $(this).replaceWith(newTag);
        }
      }
    });
    scripts.each(function(){
      const filePath = $(this).attr('src');
      if(filePath){
        const url = path.resolve(self.sourceName,'../',filePath);
        //checks if file exists
        if(fs.existsSync(url)){

          self.dissected.tailJs += `\nrequire("${self.importableUrl(filePath)}");\n`;
          $(this).remove();
        }
      }
      else{
        self.dissected.tailJs += `\n${$(this).html()}\n` || '';
        $(this).remove();
      }
    });

    const heads = $('head');
    heads.each(function(){
      self.dissected.head += $(this).html();
      $(this).remove();
    });
    const body = $('body');
    body.each(function(){
      self.dissected.body += $(this).html();
      $(this).remove();
    });
    const domModule = $('dom-module');
    domModule.each(function(){
      self.dissected.body += $(this).clone().wrap('div').parent().html();
    });

    this.dissected.body += $.html();

    if(!this.sourceName.match(/^client\//)){
      self.dissected.js += `\n\n${Synthesizer.generateJS(this.dissected.head,true)}\n\n`;
    self.dissected.js += `\n\n${Synthesizer.generateJS(this.dissected.body,)}\n\n`;
    }

    this.dissected.js += "\n\n"+this.dissected.tailJs+"\n\n";
  }
  importableUrl (url){
    if(url.match(/^(\/|https?:\/)/)){
      return false;
    }
    return url.match(/^(\.\/|\.\.\/)/) ? url : './'+url;
  }
  minify(html) {
    // Just parse the html to make sure it is correct before minifying
    HTMLTools.parseFragment(html);
    //console.log(HTMLTools)
    return htmlMinifier.minify(html, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: true,
      processScripts: ['text/template'],
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
      customAttrAssign: [/\)?\]?=/]
    });
  }

}


export const name = 'synthesis-compiler';
