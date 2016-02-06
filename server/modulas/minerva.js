/*
  Minerva
  Goddess of wisdom and sponsor of arts, trade, and strategy.
*/

"use strict";

var request = require('request');

var secret = require('./hekate')
  .auth.cti;

var watson = require('watson-developer-cloud');

if (secret.url !== 'lab') {
  var ci = watson.concept_insights({
    username: secret.usn,
    password: secret.pwd,
    version: 'v2'
  });
  // console.log('Watson COOL!');
}

// Retrieve the concepts for input text

exports.getConcepts = function(concept, limit, callback) {
  //v2/graphs/wikipedia/en-20120601/concepts/Banana/related_concepts?level=0&limit=10
  var url = secret.url + '/v2/graphs/wikipedia/en-20120601/concepts/' + concept + '/related_concepts?level=3&limit=' + limit;

  request({
    url: url,
    method: 'GET',
    auth: {
      'user': secret.usn,
      'password': secret.pwd
    },
  }, function(error, response, body) {
    callback(body);
  });
};

exports.getConcept = function(concept, callback) {
  //v2/graphs/wikipedia/en-20120601/concepts/Banana/related_concepts?level=0&limit=10
  var url = secret.url + '/v2/graphs/wikipedia/en-20120601/concepts/' + concept;

  request({
    url: url,
    method: 'GET',
    auth: {
      'user': secret.usn,
      'password': secret.pwd
    },
  }, function(error, response, body) {
    callback(body);
  });
};
