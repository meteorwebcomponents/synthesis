_synthesizer = function(settings){
  this.settings = settings;
}
_synthesizer.prototype.render = function (str,head) {
    document.addEventListener("deviceready", function() {
    var el = head ? document.head : document.body;
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }
    });
}

Synthesizer = new _synthesizer();
