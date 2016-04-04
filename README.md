# Synthesis is meteor + polymer


## Installation

`meteor add mwc:synthesis`

synthesis is a meteor 1.3+ package.

You can optionally use these packages from meteorwebcomponents

[mwc:mixin](https://github.com/meteorwebcomponents/mixin) -  Polymer data package

[mwc:router](https://github.com/meteorwebcomponents/router) - Flowrouter with polymer

## Usage

Define your elements in the client folder.

you can add js in separate file or you can add it inside the element html file using script tag.

client/test-element.html


```html
<dom-module id="test-element">
  <template>
    <paper-button on-click="showNickName">show nickname</paper-button>
    name : {{name}}
<div id="nnDiv" hidden="{{nndHidden}}">
    nickname:{{nickname}}
</div>
  </template>
</dom-module>
```
client/test-element.js

```js
Polymer({
  is:"test-element",
  properties:{
    name:{
      type:String,
      value:"Arun Kumar"
    },
    nickname:{
    type:String,
    value:"tkay"
    },
    nndHidden:{
    type:Boolean,
    value:true
    }
  },
  showNickName:function(){
  this.nndHidden = false;
  }
})

```

client/index.html (you can use any filename)

```html

<head>
  <title>Synthesis</title>

    <script src="/bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
  <link rel="import" href="/bower_components/polymer/polymer.html"/>
  <link rel="import" href="/bower_components/paper-button/paper-button.html"/>
</head>

<body class="fullbleed">
  <h1>Synthesis is Meteor + Polymer!</h1>
   <test-element></test-element>
</body>


```

Add your bower_components inside public folder.

A sample bower.json (public/bower.json)

```json
{
    "dependencies": {
        "iron-elements": "PolymerElements/iron-elements#^1.0.0",
        "neon-elements": "PolymerElements/neon-elements#^1.0.0",
        "paper-elements": "PolymerElements/paper-elements#^1.0.5",
        "polymer": "Polymer/polymer#^1.0.0"
    },
    "name": "mwc-synthesis",
    "version": "0.0.1"
}

```

### Demo

https://github.com/meteorwebcomponents/synthesis-demo

### Kickstart Your Meteor Polymer projects

https://github.com/aruntk/kickstart-meteor-polymer

![synthesis1](https://cloud.githubusercontent.com/assets/6007432/14216652/9da7131a-f867-11e5-9f84-6dd75d60dd45.gif)

### TODO

- [ ] Ability to use remote scripts
- [x] Add scripts inside html tags to app.js . (currenlty only scripts outside html tags is added(unless the tag is a body tag))
- [ ] Link imports inside html files should be vulcanized
- [x] Css inside html inlined
- [x] Client side renderer for html files added
- [x] import 'my-components.html'; support

You can use [differential:vulcanize](https://atmospherejs.com/differential/vulcanize) to vulcanize polymer elements instead of adding them in the head directly.
