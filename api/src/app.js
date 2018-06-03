'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function backendError(callback){
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      error: 'DATABASE_ERROR'
    })
  });
}

function invalidInputError(msg, callback){
  callback(null, {
    statusCode: 400,
    body: JSON.stringify({
      error: 'INVALID_INPUT',
      message: msg
    })
  });
}

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
      return backendError(callback);
    }

    const response = {};
    data.Contents.forEach((content) => {
      const parts = content.Key.split(':');
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

function validateContactsPutInput(event, callback){
  let contact;
  try {
    contact = JSON.parse(event.body);
  } catch (err) {
  }
  
  if(!contact) {
    return invalidInputError('Invalid request body. Body should be JSON object with callSign, x, and y properties.', callback);
  }

  if (!new RegExp('^[A-Za-z0-9\-]{1,20}$').test(contact.callSign || '')){
    return invalidInputError('Invalid body.callSign. Must be [A-Za-z0-9\-]{1,20}.', callback);
  }

  if (typeof contact.x !== 'number'){
    return invalidInputError('Invalid body.x. Must be a number.', callback);
  }

  if (typeof contact.y !== 'number'){
    return invalidInputError('Invalid body.y. Must be a number.', callback);
  }
  return contact;
}

/**
 * Updates a ship's call sign and position. An individual ship may invoke this to update their last contact with Mission Control.
 * @param event
 * @param context
 * @param callback
 */
function contactsPUT (event, context, callback) {
  let contact = validateContactsPutInput(event, callback);
  if (!contact) {
    return;
  }

  const params = {
    Bucket: process.env.API_BUCKET
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      return backendError(callback);
    }

    const params = {
      Bucket: process.env.API_BUCKET,
      Key: contact.callSign + ':' + contact.x + ':' + contact.y
    };
    s3.putObject(params, (err) => {
      if (err){
        return backendError(callback);
      }
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({})
      });
    });
  });
};

module.exports = {
  contactsGET,
  contactsPUT
};