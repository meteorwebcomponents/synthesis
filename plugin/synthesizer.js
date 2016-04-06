Synthesizer = function(settings){
  this.settings = settings;
}
Synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
  return `
  Synthesis.render(\`${html}\`,${append});
  `
}

Synthesis = new Synthesizer();
