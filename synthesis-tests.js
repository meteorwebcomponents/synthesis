// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by polymer.js.
import { name as packageName } from "meteor/polymer";

// Write your tests here!
// Here is an example.
Tinytest.add('polymer - example', function (test) {
  test.equal(packageName, "polymer");
});
