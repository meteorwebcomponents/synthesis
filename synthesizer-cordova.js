_synthesizer = function(settings){
  this.settings = settings;
  this._q = [];
  this.objQ = [];
}

_synthesizer.prototype.render = function (str,append) {
  this._q.push(str);
}


_synthesizer.prototype.ready = function(){

  var fns = [].concat([].slice.call(arguments));
  for (var i=0; i<fns.length; i++) {

    document.addEventListener("deviceready", function() {
      HTMLImports.whenReady(fns[i]);
    });
  }
}

document.addEventListener("deviceready", function() {
  HTMLImports.whenReady(function(){
    var el = document.body;
    var div = document.createElement('div');
    div.innerHTML = Synthesizer._q.join('\n');
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }
    var __polymer = Polymer;
    Synthesizer.objQ.forEach(function(obj){
      __polymer(obj);
    });

  });
});
Synthesizer = new _synthesizer();
