'use strict';

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

    test('should define a property', () => {
      expect(ship.exampleProperty).toEqual('exampleProperty');
    });

    test('should have a function', () => {
      expect(typeof ship.exampleFunction).toEqual('function');
    });

  });

});