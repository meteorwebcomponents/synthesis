# Synthesis is meteor + polymer


## Installation

`meteor add mwc:synthesis`

synthesis is a meteor 1.3+ package. for 1.2 support use [mwc:compiler](https://github.com/meteorwebcomponents/compiler)

You can optionally use these packages from meteorwebcomponents

* [mwc:mixin](https://github.com/meteorwebcomponents/mixin) -  Polymer data package.
* [mwc:router](https://github.com/meteorwebcomponents/router) - Flowrouter with polymer.
* [mwc:layout](https://github.com/meteorwebcomponents/layout) - Polymer layout renderer.

## Usage

Refer http://guide.meteor.com

Application Structure http://guide.meteor.com/structure.html.

Keeps all your components in imports folder 

You can import html using 

1. Meteor's `import './component.html';` 

2. `<link rel="import" href="./component.html"> `
 
Script
1. `<script>yourscript goes here</script> `

2. `<script src="component.js"></script>`

Css (its important follow these two methods to confine style inside the component.)
1. `<style>Your style goes here</style>`

2. `<link rel="stylesheet" href="component.css">`

Add bower_components to any folder inside imports directory. 

Assume bower directory is imports/ui/bower_components

```html
<!-- imports/ui/component/test-element.html -->

<link rel="import" href="test-element2.html"> <!-- imports/ui/component/test-element.html Gets imported -->
<link rel="import" href="../bower_components/paper-button/paper-button.html"> 
<script src="test-element.js"></script>
<dom-module id="test-element">
  <template>
  <link rel="stylesheet" href="test-element.css"> <!--converted to style tag. this style is restricted to elements inside the element-->
  <style> 
  #nndiv{color:blue}
  </style>
    <paper-button on-click="showNickName">
      Show nickname
    </paper-button>
    <p>
      Name : {{name}}
    </p>
    <div id="nnDiv" hidden="{{nndHidden}}">
      Nickname: {{ nickname }}
    </div>
  </template>
</dom-module>

```
```css
/*imports/ui/component/test-element.css*/
paper-button{
color:red;
}
```
```js
// imports/ui/component/test-element.js
import './test-element.html';

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
  showNickName: function () {
    this.nndHidden = false;
  }
})


```

```html
<!-- client/index.html (you can use any filename) -->
<head>
  <title>Synthesis</title>

</head>

<body class="fullbleed">
  <h1>Synthesis is Meteor + Polymer!</h1>
  <test-element></test-element>
</body>
```
```js
// client/index.js
import '../imports/ui/components/test-element.html';
  // include the webcomponents js file 
import "../imports/ui/bower_components/webcomponentsjs/webcomponents-lite.min.js";

//Remember to include a polymer component or polymer.html itself in any file

import "../imports/ui/bower_components/polymer/polymer.html";

```
Best practice is to reduce the number of files in the imports directory. Avoid adding unecessary components, helps in lowering the build time

A sample bower.json (imports/ui/bower.json)

```json
{
  "dependencies": {
    "iron-pages": "PolymerElements/iron-pages#^1.0.0",
    "neon-animations": "PolymerElements/neon-animations#^1.0.0",
    "paper-button": "PolymerElements/paper-button#^1.0.5",
    "polymer": "Polymer/polymer#^1.0.0"
  },
  "name": "mwc-synthesis",
  "version": "0.0.1"
}
```

### Demo
Check out the [Synthesis Demo](https://github.com/meteorwebcomponents/synthesis-demo)


### Kickstart Your Meteor Polymer projects
[Kickstart a Meteor/Polymer project](https://github.com/aruntk/kickstart-meteor-polymer) with Synthesis.

![synthesis1](https://cloud.githubusercontent.com/assets/6007432/14216652/9da7131a-f867-11e5-9f84-6dd75d60dd45.gif)


### TODO


### Social

Gitter - [meteorwebcomponents](https://gitter.im/aruntk/meteorwebcomponents?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

Meteor forum - https://forums.meteor.com/t/polymer-meteor-support-with-meteor-webcomponents-packages/20536

> NO NEED to use any VULCANIZING tools. Synthesis handles everything

