_synthesizer = function(settings){
  this.settings = settings;
}
_synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
  return `
  Synthesis.render(\`${html}\`,${append});
  `
}

Synthesizer = new _synthesizer();
