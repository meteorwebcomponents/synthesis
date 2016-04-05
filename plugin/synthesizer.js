Synthesizer = function(settings){
  this.settings = settings;
}
Synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
  return `
  (function () {Synthesis.render(\`${html}\`,${append});})();
  `
}

Synthesis = new Synthesizer();
