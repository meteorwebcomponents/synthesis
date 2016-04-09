_synthesizer = function(settings){
  this.settings = settings;
}
_synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
const htmlStr = `${html}`;
  return `
  Synthesizer.render(${htmlStr},${append});
  `
}

Synthesizer = new _synthesizer();
