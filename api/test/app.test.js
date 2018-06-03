'use strict';

const mockS3 = {
  listObjectsV2: jest.fn(),
  putObject: jest.fn()
};
jest.mock('aws-sdk');
const AWS = require('aws-sdk');
AWS.S3.mockImplementation(() => mockS3);
const app = require('../src/app');

let mockEvent;
let mockContext;
let callback;

beforeEach(() => {
  mockS3.listObjectsV2.mockClear();
  mockS3.putObject.mockClear();
  mockEvent = {};
  mockContext = {};
  callback = jest.fn();
  process.env.API_BUCKET = 'test-api-bucket';
});

describe('contacts GET', () => {
  test('should define a function for contacts GET', () => {
    expect(typeof app.contactsGET).toEqual('function');
  });

  test('should create single S3 instance with correct configuration', () => {
    app.contactsGET(mockEvent, mockContext, callback);
    app.contactsGET(mockEvent, mockContext, callback);

    expect(AWS.S3).toHaveBeenCalledTimes(1);
  });

  test('should start S3 request to get latest contacts from bucket', () => {
    app.contactsGET(mockEvent, mockContext, callback);

    expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(1);
    const expectedParams = {
      Bucket: 'test-api-bucket'
    };
    expect(mockS3.listObjectsV2).toBeCalledWith(expectedParams, expect.any(Function))
  });

  test('should use API_BUCKET environment variable for bucket configuration', () => {
    process.env.API_BUCKET = 'test-api-bucket2';

    app.contactsGET(mockEvent, mockContext, callback);

    const expectedParams = {
      Bucket: 'test-api-bucket2'
    };
    expect(mockS3.listObjectsV2).toBeCalledWith(expectedParams, expect.any(Function))
  });

  test('should return an error if list fails', () => {
    app.contactsGET(mockEvent, mockContext, callback);

    expect(callback).toHaveBeenCalledTimes(0);

    // listObjectsV2 Error response
    mockS3.listObjectsV2.mock.calls[0][1]({error: 'AWS SDK error'});

    expect(callback).toHaveBeenCalledTimes(1);
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({
        error: 'DATABASE_ERROR'
      })
    };
    expect(callback).toHaveBeenCalledWith(null, expectedResponse);
  });

  test('should parse keys and reply with call signs and coordinates', () => {
    app.contactsGET(mockEvent, mockContext, callback);

    // listObjectsV2 success response
    mockS3.listObjectsV2.mock.calls[0][1](null, {
      Contents: [
        {
          Key: 'callsign1:50.32:88'
        },
        {
          Key: 'callsign2:1:2'
        }
      ]
    });

    expect(callback).toHaveBeenCalledTimes(1);
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        callsign1: {
          x: 50.32,
          y: 88
        },
        callsign2: {
          x: 1,
          y: 2
        }
      })
    };
    expect(callback).toHaveBeenCalledWith(null, expectedResponse);
  });

  test('should handle an empty bucket', () => {
    app.contactsGET(mockEvent, mockContext, callback);

    // listObjectsV2 success response
    mockS3.listObjectsV2.mock.calls[0][1](null, {
      Contents: []
    });

    expect(callback).toHaveBeenCalledTimes(1);
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({})
    };
    expect(callback).toHaveBeenCalledWith(null, expectedResponse);
  });
});

describe('contacts PUT', () => {
  beforeEach(() => {
    mockEvent.body = JSON.stringify({
      callSign: 'enterprise-1',
      x: 50,
      y: 100.01
    });
  });
  
  test('should define a function for contacts GET', () => {
    expect(typeof app.contactsPUT).toEqual('function');
  });

  describe('input validation', () => {
    test('should return an error if no body is provided', () => {
      mockEvent.body = 'invalid';

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid request body. Body should be JSON object with callSign, x, and y properties.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should return an error if callSign is missing', () => {
      mockEvent.body = JSON.stringify({x: 50, y: 100});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.callSign. Must be [A-Za-z0-9\-]{1,20}.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should return an error if x is missing', () => {
      mockEvent.body = JSON.stringify({callSign: 'enterprise-1', y: 100});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.x. Must be a number.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should return an error if y is missing', () => {
      mockEvent.body = JSON.stringify({callSign: 'enterprise-1', x: 50});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.y. Must be a number.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should restrict callSign length', () => {
      mockEvent.body = JSON.stringify({callSign: 'callSignThatIsTooLong', x: 50, y: 100});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.callSign. Must be [A-Za-z0-9\-]{1,20}.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should restrict callSign accepted characters', () => {
      mockEvent.body = JSON.stringify({callSign: '-invalid/char s', x: 50, y: 100});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.callSign. Must be [A-Za-z0-9\-]{1,20}.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should restrict x to be a number', () => {
      mockEvent.body = JSON.stringify({callSign: 'enterprise-1', x: '50', y: 100});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.x. Must be a number.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });

    test('should restrict y to be a number', () => {
      mockEvent.body = JSON.stringify({callSign: 'enterprise-1', x: 50, y:{}});

      app.contactsPUT(mockEvent, mockContext, callback);

      expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(0);
      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 400,
        body: JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Invalid body.y. Must be a number.'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });
  });

  test('should check to see if the call sign is already registered', () => {
    app.contactsPUT(mockEvent, mockContext, callback);

    expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(1);
    const expectedParams = {
      Bucket: 'test-api-bucket'
    };
    expect(mockS3.listObjectsV2).toHaveBeenCalledWith(expectedParams, expect.any(Function));
  });

  test('should return an error if the existing call sign lookup fails', () => {
    app.contactsPUT(mockEvent, mockContext, callback);

    expect(callback).toHaveBeenCalledTimes(0);

    // Call sign lookup failure
    mockS3.listObjectsV2.mock.calls[0][1]({error: 'AWS SDK error'});

    expect(mockS3.putObject).toHaveBeenCalledTimes(0);
    expect(callback).toHaveBeenCalledTimes(1);
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({
        error: 'DATABASE_ERROR'
      })
    };
    expect(callback).toHaveBeenCalledWith(null, expectedResponse);
  });

  test('should delete the call sign if it exists', () => {

  });

  test('should return an error if the delete fails', () => {

  });

  test('should update the call sign after a delete', () => {

  });

  test('should return an error if the update after a delete fails', () => {

  });

  describe('callSign doesn\'t already exist', () => {
    test('should add the call sign if it doesn\'t exist', () => {
      app.contactsPUT(mockEvent, mockContext, callback);
  
      // Call sign lookup success
      mockS3.listObjectsV2.mock.calls[0][1](null, {
        Contents: [
          {
            Key: 'callsign1:50.32:88'
          },
          {
            Key: 'callsign2:1:2'
          }
        ]
      });
  
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockS3.putObject).toHaveBeenCalledTimes(1);
      const expectedParams = {
        Bucket: 'test-api-bucket',
        Key: 'enterprise-1:50:100.01'
      };
      expect(mockS3.putObject).toHaveBeenCalledWith(expectedParams, expect.any(Function));
    });
  
    test('should return an error if the update without a delete fails', () => {
      app.contactsPUT(mockEvent, mockContext, callback);
  
      // Call sign lookup success
      mockS3.listObjectsV2.mock.calls[0][1](null, {
        Contents: [
          {
            Key: 'callsign1:50.32:88'
          },
          {
            Key: 'callsign2:1:2'
          }
        ]
      });
      
      expect(callback).toHaveBeenCalledTimes(0);

      //Error during object put
      mockS3.putObject.mock.calls[0][1]({error: 'AWS SDK error while putting object in S3'});

      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 500,
        body: JSON.stringify({
          error: 'DATABASE_ERROR'
        })
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });
  
    test('should return success if the update without a delete succeeds', () => {
      app.contactsPUT(mockEvent, mockContext, callback);
  
      // Call sign lookup success
      mockS3.listObjectsV2.mock.calls[0][1](null, {
        Contents: [
          {
            Key: 'callsign1:50.32:88'
          },
          {
            Key: 'callsign2:1:2'
          }
        ]
      });
      
      expect(callback).toHaveBeenCalledTimes(0);

      //Successful object save
      mockS3.putObject.mock.calls[0][1](null, {});

      expect(callback).toHaveBeenCalledTimes(1);
      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify({})
      };
      expect(callback).toHaveBeenCalledWith(null, expectedResponse);
    });
  });

  test('should return an error if there are too many registered call signs', () => {

  });
});

