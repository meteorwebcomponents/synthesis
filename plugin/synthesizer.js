Synthesizer = function(settings){
  this.settings = settings;
}
Synthesizer.prototype.generateJS =function(html,append){
  append = !!append;
  return `
<<<<<<< HEAD
  Synthesis.render(\`${html}\`,${append});
=======
  (function () {Synthesis.render(\`${html}\`,${append});})();
>>>>>>> 756144d3d05eaf52296ab3217138578209bf1cde
  `
}

Synthesis = new Synthesizer();
