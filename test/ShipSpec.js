'use strict';

let sinon = require('sinon');
let assert = require('chai').assert;
let Ship = require('../src/Ship');

/**
 * The most important file in this project, the ship spec.
 */
describe('Ship', () => {

  let ship;

  beforeEach(() => {
    ship = new Ship();
  });

  describe('Some ship feature', () => {

    it('should do something', () => {
      // What should it do?
    });

  });

});