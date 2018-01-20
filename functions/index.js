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

const admin = require('firebase-admin');
const functions = require('firebase-functions');
try { admin.initializeApp(functions.config().firebase); } catch(e) {} // You do that because the admin SDK can only be initialized once.
const firestore = admin.firestore();
const logging = require('@google-cloud/logging')();
const gcs = require('@google-cloud/storage')();
const cors = require('cors');
const express = require('express');
// const stripe = require('stripe')(functions.config().stripe.token);

module.exports = require('./exports')({
  admin, cors, express, functions, firestore, gcs, logging
});

