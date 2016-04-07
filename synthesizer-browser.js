_synthesizer = function(settings){
  this.settings = settings;
  this._q = [];
  this.pObjs = [];
}
Function.prototype.extend = function() {
  var fns = [this].concat([].slice.call(arguments));
  return function() {
    for (var i=0; i<fns.length; i++) {
      fns[i].apply(this, arguments);
    }
  };
};


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
HTMLDocument.prototype.ready = function () {
  return new Promise(function(resolve, reject) {
    if (document.readyState === 'complete') {
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
    document.interactive().then(fns[i]);
  }
}
if(Meteor.isClient){
  document.interactive().then(function(){
    var el = document.body;
    var div = document.createElement('div');
    div.innerHTML = Synthesizer._q.join(`\n`);
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }


    Synthesizer.pObjs.forEach(function(obj){
      Polymer(obj);
    });
  });

}

Synthesizer = new _synthesizer();
