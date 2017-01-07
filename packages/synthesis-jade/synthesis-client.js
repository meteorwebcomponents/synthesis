export class _synthesizer {
  constructor(settings) {
    this.settings = settings;
  }
  render(str, head) {
    if (document.body) {
      const el = head ? document.head : document.body;
      const div = document.createElement('div');
      const docFrag = document.createDocumentFragment();
      div.innerHTML = str;
      while (div.children.length > 0) {
        docFrag.appendChild(div.children[0]);
      }
      el.appendChild(docFrag);
    } else {
      document.write(str);
    }
  }
}

Synthesis = new _synthesizer();
