// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by synthesis.js.
import { name as packageName } from "meteor/synthesis";

// Write your tests here!
// Here is an example.
Tinytest.add('polymer - example', function (test) {
  test.equal(packageName, "synthesis");
});
