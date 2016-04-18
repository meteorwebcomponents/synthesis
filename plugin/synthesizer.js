_synthesizer = function(settings){
  this.settings = settings;
}
_synthesizer.prototype.generateJS =function(html,toHead){
  toHead = !!toHead;
  const htmlStr = JSON.stringify(html);
  return `
  Synthesizer.render(${htmlStr},${toHead});
  `
}

Synthesizer = new _synthesizer();
