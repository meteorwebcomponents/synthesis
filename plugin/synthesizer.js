_synthesizer = function(settings){
  this.settings = settings;
}
_synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
  const htmlStr = JSON.stringify(html);
  return `
  Synthesizer.render(${htmlStr},${append});
  `
}

Synthesizer = new _synthesizer();
