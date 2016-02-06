/*
  Hekate
  Powerful and wise gate keeper between the worlds
*/

'use strict';

// var cloudantAuth = {
//   usn: 'lab',
//   url: 'http://127.0.0.1:5984',
//   init: function(cred) {
//     return {
//       url: cred.url,
//       usn: cred.username,
//       pwd: cred.password,
//     };
//   },
// };
//
// var redisAuth = {
//   hst: 'lab',
//   init: function(cred) {
//     return {
//       prt: cred.port,
//       hst: cred.hostname,
//       pwd: cred.password,
//     };
//   },
// };

var ctiAuth = {
  url: 'lab',
  init: function(cred) {
    return {
      url: cred.url,
      usn: cred.username,
      pwd: cred.password,
    };
  },
};

// Check if BLUEMIX env exist
if (process.env.VCAP_SERVICES) {
  var vcapServices =
    JSON.parse(process.env.VCAP_SERVICES);

  // NOTE: cloudantNoSQLDB
  // cloudantAuth = cloudantAuth.init(vcapServices.cloudantNoSQLDB[0].credentials);

  // NOTE: rediscloud
  // redisAuth = redisAuth.init(vcapServices.rediscloud[0].credentials);

  // NOTE: concept_insights
  ctiAuth = ctiAuth.init(vcapServices.concept_insights[0].credentials);
}

// Export keys
exports.auth = {
  // cloudant: cloudantAuth,
  // redis: redisAuth,
  cti: ctiAuth,
};

module.exports = exports;
