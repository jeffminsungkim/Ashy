'use strict';
/** EXPORT ALL FUNCTIONS
*
*  Loads all `.f.js` files
*  Exports a cloud function matching the file name
*  Author: David King
*  Edited: Tarik Huber
*  Based on this thread:
*  https://github.com/firebase/functions-samples/issues/170
*/

/**
 *  IMPORTANT!
 *  Recommend that treat your index.js file your main file.
 *  The main file is very simple boilerplate that composes very, very rigorously tested libraries.
*/

const glob = require("glob");
const camelCase = require("camelcase");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp(functions.config().firebase); } catch(e) {} // You do that because the admin SDK can only be initialized once.
const firestore = admin.firestore();

const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**'});
for(let f = 0,fl = files.length; f < fl; f++){
  const file = files[f];
  const functionName = camelCase(file.slice(0, -5).split('/').join('_')); // Strip off '.f.js'
  if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) exports[functionName] = require(file);
}

