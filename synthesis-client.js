Synthesizer = function(settings){
  this.settings = settings;
  this._q = [];
}

//if(Meteor.isClient){
Synthesizer.prototype.render = function (str,append) {
  var el = document.body;
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
//}

// In cordova check deviceready before inserting.
//if(Meteor.isCordova){

//Synthesizer.prototype.render = function (str,append) {
//this._q.push(str);
//}


//document.addEventListener("deviceready",renderQ,false); 


//var renderQ = function(){
//var el = document.body;
//var div = document.createElement('div');
//div.innerHTML = Synthesis._q.join(`\n`);
//while (div.children.length > 0) {
//if(append){
//el.appendChild(div.children[0]);
//}
//else{
//el.insertBefore(div.children[0],el.childNodes[0]);
//}
//}


//}
//}



Synthesis = new Synthesizer();
