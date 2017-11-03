'use strict';

/**
 * DO NOT LOOK AT THIS UNTIL COMPLETING THE PROJECT!!! This is my personal test implementation for all the tasks.
 *
 * @author Aaron Bruckner
 */

let assert = require('chai').assert;
let Ship = require('../src/ShipExample');

describe('Ship', () => {

  let ship;

  beforeEach(() => {
    ship = new Ship();
  });

  describe('hull', function () {

    it('should have hitpoints', function () {
      assert.isNumber(ship.hitpoints, 'should define hitpoints on ship');
    });

    it('should initialize ship to 100 hitpoints', function () {
      assert.equal(ship.hitpoints, 100, 'should initialize ship to 100 hitpoints');
    });

    describe('damageShip', () => {

      it('should be defined', () => {
        assert.isFunction(ship.damageShip, 'should define function');
      });

      it('should damage the ship', () => {
        ship.damageShip(5);

        assert.equal(ship.hitpoints, 95, 'should deal 5 points of damage to the ship');
      });

      it('should damage the ship based on damage number passed in', () => {
        ship.damageShip(5);
        ship.damageShip(10)

        assert.equal(ship.hitpoints, 85, 'should deal 15 points of total damage to the ship');
      });

      it('should not allow the ship\'s hitpoints to fall below 0', () => {
        ship.damageShip(95);
        ship.damageShip(6);

        assert.equal(ship.hitpoints, 0, 'should not drop below 0 hitpoints');
      });
    });
  });

  // TODO: Damage submodules
  describe('submodules', () => {

    it('should expose submodules property', () => {
      assert.isObject(ship.submodules, 'should expose submodules');
    });

    describe('shield', () => {
      it('should expose shield submodule', () => {
        assert.isObject(ship.submodules.shield, 'should expose shield submodule');
      });

      it('should expose 4 shield quadrants', () => {
        assert.isObject(ship.submodules.shield.front, 'should have front quadrant');
        assert.isObject(ship.submodules.shield.back, 'should have back quadrant');
        assert.isObject(ship.submodules.shield.left, 'should have left quadrant');
        assert.isObject(ship.submodules.shield.right, 'should have right quadrant');
      });

      it('should initialize the quadrants to the correct hitpoint values', () => {
        assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should correctly initialize front shield');
        assert.equal(ship.submodules.shield.back.hitpoints, 10, 'should correctly initialize back shield');
        assert.equal(ship.submodules.shield.left.hitpoints, 15, 'should correctly initialize left shield');
        assert.equal(ship.submodules.shield.right.hitpoints, 15, 'should correctly initialize right shield');
      });

      describe('damageShield', () => {

        it('should define function', () => {
          assert.isFunction(ship.damageShield, 'should define function');
        });

        it('should damage a shield quadrant', () => {
          ship.damageShield('left', 5);

          assert.equal(ship.submodules.shield.left.hitpoints, 10, 'should damage shield quadrant');
        });

        it('should damage multiple shield quadrants', () => {
          ship.damageShield('front', 1);
          ship.damageShield('back', 2);
          ship.damageShield('left', 3);
          ship.damageShield('right', 4);

          assert.equal(ship.submodules.shield.front.hitpoints, 29, 'should damage front');
          assert.equal(ship.submodules.shield.back.hitpoints, 8, 'should damage back');
          assert.equal(ship.submodules.shield.left.hitpoints, 12, 'should damage left');
          assert.equal(ship.submodules.shield.right.hitpoints, 11, 'should damage right');
        });

        it('should not allow shield to drop below zero', () => {
          ship.damageShield('front', 31);

          assert.equal(ship.submodules.shield.front.hitpoints, 0, 'should not drop below 0');
        });

        it('should return zero unabsorbed damage when shield fully absorbs it', () => {
          assert.equal(ship.damageShield('front', 1), 0, 'should return 0 unabsorbed damage');
        });

        it('should return unabsorbed damage when shield fully depleted', () => {
          assert.equal(ship.damageShield('back', 11), 1, 'should return 1 point of unabsorbed damage');
          assert.equal(ship.damageShield('back', 5), 5, 'should return 5 point of unabsorbed damage');
        });

        it('should throw an exception if unknown shield quadrant is passed in', () => {
          function test() {
            ship.damageShield('unknown', 5);
          }
          assert.throws(test, 'Invalid shield quadrant provided');
        });
      });

      describe('calculateShieldPercentage', () => {

        it('should define function', () => {
          assert.isFunction(ship.calculateShieldPercentage, 'should define function');
        });

        it('should return shield percentage', () => {
          assert.equal(ship.calculateShieldPercentage('front'), 100);
        });

        it('should return shield percentage for all quadrants', () => {
          ship.damageShield('front', 15);
          ship.damageShield('left', 15);
          ship.damageShield('back', 5);

          assert.equal(ship.calculateShieldPercentage('front'), 50, 'should return correct percentage for front');
          assert.equal(ship.calculateShieldPercentage('back'), 50, 'should return correct percentage for back');
          assert.equal(ship.calculateShieldPercentage('left'), 0, 'should return correct percentage for left');
          assert.equal(ship.calculateShieldPercentage('right'), 100, 'should return correct percentage for right');
        });

        it('should round shield percentage to the nearest whole number', () => {
          ship.damageShield('front', 1);
          ship.damageShield('left', 1);

          assert.equal(ship.calculateShieldPercentage('front'), 97, 'should round up to nearest whole number');
          assert.equal(ship.calculateShieldPercentage('left'), 93, 'should round down to nearest whole number');
        });

        it('should throw an exception if unknown shield quadrant is passed in', () => {
          function test() {
            ship.calculateShieldPercentage('unknown');
          }
          assert.throws(test, 'Invalid shield quadrant provided');
        });
      });
    });

  });

});