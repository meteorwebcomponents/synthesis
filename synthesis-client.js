Synthesizer = function(settings){
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
//Meteor.startup(function(){
  //Synthesis.pObjs.forEach(function(obj){
    //Polymer.apply(null,obj);
  //});

//});
//document.interactive().then(function(){

Meteor.startup(function(){
  var el = document.body;
  Synthesis._q.forEach(function(obj){

    el.innerHTML += obj.str;
    //var div = document.createElement('div');
    //div.innerHTML = obj.str;
    //while (div.children.length > 0) {
      //if(obj.append){
        //el.appendChild(div.children[0]);
      //}
      //else{
        //el.insertBefore(div.children[0],el.childNodes[0]);
      //}
    //}

  });



});
//});

//if(Meteor.isClient){
Synthesizer.prototype.render = function (str,append) {
  Synthesis._q.push({str:str,append:append});

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
