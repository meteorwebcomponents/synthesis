// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by synthesis-jade.js.
import { name as packageName } from "meteor/synthesis-jade";

// Write your tests here!
// Here is an example.
Tinytest.add('synthesis-jade - example', function (test) {
  test.equal(packageName, "synthesis-jade");
});
