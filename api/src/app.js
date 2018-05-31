'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * Gets a list of reported contacts. Ships can invoke this endpoint to see every ship that has reported their call sign
 * and position.
 *
 * @param event
 * @param context
 * @param callback
 */
function contactsGET (event, context, callback) {
  const params = {
    Bucket: process.env.API_BUCKET
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: 'DATABASE_ERROR'
        })
      });
    }

    const response = {};
    data.Contents.forEach((content) => {
      const parts = content.Key.split('/');
      response[parts[0]] = {
        x: Number(parts[1]),
        y: Number(parts[2])
      }
    });
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    });
  });
};

/**
 * Updates a ship's call sign and position. An individual ship may invoke this to update their last contact with Mission Control.
 * @param event
 * @param context
 * @param callback
 */
function contactsPUT (event, context, callback) {
  // const params = {
  //   Bucket: process.env.API_BUCKET,
  //   Key: 'helloWorld/12/13'
  // };
  // s3.putObject(params, (err, data) => {
  //   callback(null, {
  //     statusCode: 200,
  //     body: JSON.stringify(err)
  //   });
  // });
  // callback(null, {
  //   'statusCode': 200,
  //   'body': JSON.stringify({
  //     message: 'Contacts PUT'
  //   })
  // });
};

module.exports = {
  contactsGET,
  contactsPUT
};