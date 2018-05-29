'use strict';

const app = require('../src/app');

describe('contacts GET', () => {
  let mockS3;
  let mockEvent;
  let mockContext;
  let callback;

  beforeEach(() => {
    mockEvent = {};
    mockContext = {};
    callback = jest.fn();

    mockS3 = {
      listObjectsV2: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should define a function for contacts GET', () => {
    expect(typeof app.contactsGET).toEqual('function');
  });

  test('should create single S3 instance with correct configuration', () => {
    // app.contactsGET(mockEvent, mockContext, callback);
    //
    // expect(AWS.S3).toHaveBeenCalledTimes(1);
  });

  // test('should start S3 request to get latest contacts from bucket', () => {
  //   let app = require('../src/app.js');
  //   app.contactsGET(mockEvent, mockContext, callback);
  //
  //   expect(mockS3.listObjectsV2).toHaveBeenCalledTimes(1);
  // });
  //
  // test('should return contacts via callback after S3 returns', () => {
  //
  // });
});

describe('contacts PUT', () => {
  // test('should define a function for contacts GET', () => {
  //   expect(typeof app.contactsPUT).toEqual('function');
  // });
});

