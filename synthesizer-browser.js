_synthesizer = function(settings){
  this.settings = settings;
  this._q = [];
}

HTMLDocument.prototype.interactive = function () {
  return new Promise(function(resolve, reject) {
    if (document.readyState === 'interactive') {
      resolve(document);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        resolve(document);
      });
    }
  });
}

_synthesizer.prototype.render = function (str,append) {
  this._q.push(str);
}


_synthesizer.prototype.ready = function(){
  var fns = [].concat([].slice.call(arguments));
  for (var i=0; i<fns.length; i++) {
    HTMLImports.whenReady(fns[i]);
  }
}
HTMLImports.whenReady(function(){
  var el = document.body;
  var div = document.createElement('div');
  div.innerHTML = Synthesizer._q.join('\n');
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
});

Synthesizer = new _synthesizer();
