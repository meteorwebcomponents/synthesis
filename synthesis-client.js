Synthesizer = function(settings){
  this.settings = settings;
}
Synthesizer.prototype.body = {
  _render:function (el, str,append) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
      if(append){
      el.appendChild(div.children[0]);
      }
      else{
      el.insertBefore(div.children[0],el.childNodes[0]);
      }
    }
    return true;
  }


}
Synthesis = new Synthesizer();
