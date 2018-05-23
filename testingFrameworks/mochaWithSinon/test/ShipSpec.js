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

    it('should define a property', () => {
      assert.equal(ship.exampleProperty, 'exampleProperty', 'should define a property');
    });

    it('should have a function', () => {
      assert.isFunction(ship.exampleFunction, 'should define a function');
    });

  });

});