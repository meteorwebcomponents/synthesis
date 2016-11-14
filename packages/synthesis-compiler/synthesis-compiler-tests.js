// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest';

// Import and rename a variable exported by synthesis-compiler.js.
import { name as packageName } from 'meteor/synthesis-compiler';

// Write your tests here!
// Here is an example.
Tinytest.add('synthesis-compiler - example', (test) => {
  // Tests
  test.equal(packageName, 'synthesis-compiler');
});
