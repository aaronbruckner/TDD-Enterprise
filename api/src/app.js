'use strict';

// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();

/**
 * Gets a list of reported contacts. Ships can invoke this endpoint to see every ship that has reported their call sign
 * and position.
 *
 * @param event
 * @param context
 * @param callback
 */
function contactsGET (event, context, callback) {
  // let s3 = new AWS.S3();
  // s3.listObjectsV2();
  callback(null, {
    'statusCode': 200,
    'body': JSON.stringify({
      message: 'Contacts GET'
    })
  });
};

/**
 * Updates a ship's call sign and position. An individual ship may invoke this to update their last contact with Mission Control.
 * @param event
 * @param context
 * @param callback
 */
// contactsPUT = async (event, context, callback) => {
//   callback(null, {
//     'statusCode': 200,
//     'body': JSON.stringify({
//       message: 'Contacts PUT'
//     })
//   });
// };

module.exports = {
  contactsGET
};