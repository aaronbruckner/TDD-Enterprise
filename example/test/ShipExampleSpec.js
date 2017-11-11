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

  describe('next round', function () {

    it('should be defined as a function', () => {
      assert.isFunction(ship.nextRound, 'should define nextRound function');
    });

  });

  describe('hull', () => {

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

  describe('submodules', () => {

    it('should expose submodules property', () => {
      assert.isObject(ship.submodules, 'should expose submodules');
    });

    describe('damageSubmodule', () => {

      it('should expose function', () => {
        assert.isFunction(ship.damageSubmodule, 'should expose function');
      });

      it('should damage an OK submodule to DAMAGED', function () {
        ship.damageSubmodule('shield');

        assert.equal(ship.submodules.shield.status, 'DAMAGED', 'should damage submodule');
      });

      it('should damage a DAMAGED submodule to DESTROYED', function () {
        ship.damageSubmodule('shield');
        ship.damageSubmodule('shield');

        assert.equal(ship.submodules.shield.status, 'DESTROYED', 'should destroy submodule');
      });

      it('should have no effect on a DESTROYED submodule', function () {
        ship.damageSubmodule('shield');
        ship.damageSubmodule('shield');
        ship.damageSubmodule('shield');

        assert.equal(ship.submodules.shield.status, 'DESTROYED', 'should do nothing to a destroyed module');
      });

      it('should throw an exception if an unknown submodule is damaged', function () {
        function test() {
          ship.damageSubmodule('unknown');
        }

        assert.throws(test, 'Invalid submodule provided');
      });

    });

    describe('shield', () => {

      it('should expose shield submodule', () => {
        assert.isObject(ship.submodules.shield, 'should expose shield submodule');
      });

      it('should have a status', () => {
        assert.isString(ship.submodules.shield.status, 'should have status');
      });

      it('should initialize to status "OK"', () => {
        assert.equal(ship.submodules.shield.status, 'OK', 'should start as status OK');
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

        it('should return unabsorbed damage when shield is broken and being recharged', () => {
          ship.damageShield('front', 30);

          ship.nextRound();

          assert.equal(ship.damageShield('front', 10), 10, 'should return all damage when targeting broken shield');
          assert.equal(ship.submodules.shield.front.hitpoints, 10, 'should not damage a broken shield');
        });

        it('should damage a shield after it\'s fully charged', () => {
          ship.damageShield('front', 30);

          ship.nextRound();
          ship.nextRound();
          ship.nextRound();

          assert.equal(ship.damageShield('front', 10), 0, 'should absorb all damage from recharged shield');
          assert.equal(ship.submodules.shield.front.hitpoints, 20, 'should reduce hitpoints on shield');
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

      describe('shield regeneration', () => {

        it('should regenerate the shield on passed round', () => {
          ship.damageShield('front', 10);
          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should regenerate the shield');
        });

        it('should regenerate the shield over multiple rounds', () => {
          ship.damageShield('front', 20);

          ship.nextRound();
          assert.equal(ship.submodules.shield.front.hitpoints, 20, 'should regenerate 10 hitpoints');
          ship.nextRound();
          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should regenerate another 10 hitpoints');
        });

        it('should not regenerate shield past max hitpoints', () => {
          ship.damageShield('front', 5);
          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should not surpass max');
        });

        it('should pick the lowest quadrant to heal', () => {
          ship.damageShield('front', 5);
          ship.damageShield('back', 1);

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 25, 'should not pick shield with more hitpoints');
          assert.equal(ship.submodules.shield.back.hitpoints, 10, 'should regenerate lowest hitpoint quadrant');
        });

        it('should do nothing if all shields are full', function () {
          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should not heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 10, 'should not heal back');
          assert.equal(ship.submodules.shield.left.hitpoints, 15, 'should not heal left');
          assert.equal(ship.submodules.shield.right.hitpoints, 15, 'should not heal right');
        });

        it('should continue to heal a broken shield once started event if other quadrants are lower', () => {
          ship.damageShield('front', 30);
          ship.damageShield('back', 9);
          ship.damageShield('left', 13);
          ship.damageShield('right', 13);

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 10, 'should heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 1, 'should not heal back');
          assert.equal(ship.submodules.shield.left.hitpoints, 2, 'should not heal left');
          assert.equal(ship.submodules.shield.right.hitpoints, 2, 'should not heal right');

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 20, 'should continue to heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 1, 'should not heal back');
          assert.equal(ship.submodules.shield.left.hitpoints, 2, 'should not heal left');
          assert.equal(ship.submodules.shield.right.hitpoints, 2, 'should not heal right');

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should continue to heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 1, 'should not heal back');
          assert.equal(ship.submodules.shield.left.hitpoints, 2, 'should not heal left');
          assert.equal(ship.submodules.shield.right.hitpoints, 2, 'should not heal right');

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should no longer heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 10, 'should switch to healing back');
          assert.equal(ship.submodules.shield.left.hitpoints, 2, 'should not heal left');
          assert.equal(ship.submodules.shield.right.hitpoints, 2, 'should not heal right');
        });

        it('should only regenerate 5 points if shield submodule is damaged', () => {
          ship.damageSubmodule('shield');
          ship.damageShield('front', 10);

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 25, 'should heal only 5 hitpoints if submodule is damaged');
        });

      });
    });

  });

});