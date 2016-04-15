_synthesizer = function(settings){
  this.settings = settings;
  this._q = [];
}
_synthesizer.prototype.render = function (str,append) {
  this._q.push(str);
}

HTMLDocument.prototype.ready = function () {
  return new Promise(function(resolve, reject) {
    document.addEventListener("deviceready", function(info) {

      HTMLImports.whenReady(function(){

        resolve(document);
      })
    });
  });
}

_synthesizer.prototype.ready = function(){
  var fns = [].concat([].slice.call(arguments));
  for (var i=0; i<fns.length; i++) {
    document.addEventListener("deviceready", function(info) {
      HTMLImports.whenReady(fns[i])
    });
  }
}

document.addEventListener("deviceready", function(info) {

  var renderQ = function(){
    var el = document.body;
    var div = document.createElement('div');
    div.innerHTML = Synthesizer._q.join('\n');
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }


  }
  renderQ();

});

Synthesizer = new _synthesizer();
