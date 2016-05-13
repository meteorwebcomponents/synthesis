class _synthesizer{
  constructor(settings){
    this.settings = settings;
  }
  generateJS(html,toHead){
    toHead = !!toHead;
    const htmlStr = JSON.stringify(html);
    return `
    Synthesizer.render(${htmlStr},${toHead});
    `
  }

}
Synthesizer = new _synthesizer();
