Synthesizer = function(settings){
  this.settings = settings;
}
Synthesizer.prototype.body = {
  generateJS:function(html,append){
    return `
    Meteor.startup(Synthesis.body._render(document.body, '${html}',${append}));
    `
  }
}
Synthesis = new Synthesizer();
