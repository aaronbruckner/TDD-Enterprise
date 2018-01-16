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

      ['shield', 'missileLauncher'].forEach((submodule) => {
        describe('submodule ' + submodule, () => {
          it('should damage an OK submodule to DAMAGED', function () {
            ship.damageSubmodule(submodule);

            assert.equal(ship.submodules[submodule].status, 'DAMAGED', 'should damage submodule');
          });

          it('should damage a DAMAGED submodule to DESTROYED', function () {
            ship.damageSubmodule(submodule);
            ship.damageSubmodule(submodule);

            assert.equal(ship.submodules[submodule].status, 'DESTROYED', 'should destroy submodule');
          });

          it('should have no effect on a DESTROYED submodule', function () {
            ship.damageSubmodule(submodule);
            ship.damageSubmodule(submodule);
            ship.damageSubmodule(submodule);

            assert.equal(ship.submodules[submodule].status, 'DESTROYED', 'should do nothing to a destroyed module');
          });
        });
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

      describe('shield collapse', () => {

        it('should not absorb damage if two shields are broken', () => {
          ship.damageShield('front', 30);
          ship.damageShield('left', 15);

          let unabsorbedDamage = ship.damageShield('right', 15);

          assert.equal(unabsorbedDamage, 15, 'should return all damage when two other shield are broken');
          assert.equal(ship.submodules.shield.right.hitpoints, 15, 'should not do any damage when two other shields are broken');
        });

        it('should not absorb damage if one shields is broken and another is regenerating from a broken state', () => {
          ship.damageShield('front', 30);
          ship.damageShield('left', 15);
          ship.nextRound();

          let unabsorbedDamage = ship.damageShield('right', 15);

          assert.equal(unabsorbedDamage, 15, 'should return all damage when two other shield are broken');
          assert.equal(ship.submodules.shield.right.hitpoints, 15, 'should not do any damage when two other shields are broken');
        });

      });

      describe('shield destroyed', () => {

        it('should drop all shield quadrants to zero hitpoints', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');

          assert.equal(ship.submodules.shield.front.hitpoints, 0, 'should drop front to zero hitpoints');
          assert.equal(ship.submodules.shield.back.hitpoints, 0, 'should drop back to zero hitpoints');
          assert.equal(ship.submodules.shield.left.hitpoints, 0, 'should drop left to zero hitpoints');
          assert.equal(ship.submodules.shield.right.hitpoints, 0, 'should drop right to zero hitpoints');
        });

        it('should disable shield regeneration', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 0, 'should not heal front');
          assert.equal(ship.submodules.shield.back.hitpoints, 0, 'should not heal back');
          assert.equal(ship.submodules.shield.left.hitpoints, 0, 'should not heal left to');
          assert.equal(ship.submodules.shield.right.hitpoints, 0, 'should not heal right to');
        });

        it('should restore shield regeneration after submodule is repaired', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');
          ship.assignEngineer('shield')

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 5, 'should heal front after shield module repaired');
        });

        it('should not allow any damage to shield to be absorbed', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');

          assert.equal(ship.damageShield('front', 10), 10, 'should return all damage as unabsorbed');
        });

        it('should not allow a single fully charged shield to absorb damage while the other quadrants are still broken', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');
          ship.assignEngineer('shield');

          ship.nextRound();
          ship.nextRound();
          ship.nextRound();
          ship.nextRound();

          assert.equal(ship.damageShield('front', 10), 10, 'should retun all damage as unabsorbed if only one quadrant has been restored');
        });

      });
    });

    describe('missileLauncher', () => {

      it('should exist', () => {
        assert.isObject(ship.submodules.missileLauncher, 'should have missileLauncher submodule');
      });

      it('should have a status', () => {
        assert.isString(ship.submodules.missileLauncher.status, 'should have status');
      });

      it('should initialize to status "OK"', () => {
        assert.equal(ship.submodules.missileLauncher.status, 'OK', 'should start as status OK');
      });

      describe('fireMissile', () => {

        it('should start with zero targets', () => {
          assert.isArray(ship.submodules.missileLauncher.targets, 'should track targets in an array');
          assert.equal(ship.submodules.missileLauncher.targets.length, 0, 'should start with 0 targets');
        });

        it('should be defined', () => {
          assert.isFunction(ship.fireMissile, 'should define function');
        });

        it('should add new target to list of tracked targets', () => {
          let target = {
            id: 'enemyShip1',
            distance: 5,
            hit: () => {}
          };

          ship.fireMissile(target);

          assert.equal(ship.submodules.missileLauncher.targets.length, 1, 'should be 1 target');
          assert.equal(ship.submodules.missileLauncher.targets[0], target, 'should add provided target to targets');
        });

      });

      describe('missile progression', () => {

        it('should move 1 disance unit closer to target with every round', () => {
          let target1 = {
            id: 'target1',
            distance: 5,
            hit: () => {}
          };
          let target2 = {
            id: 'target2',
            distance: 3,
            hit: () => {}
          };

          ship.fireMissile(target1);
          ship.fireMissile(target2);

          ship.nextRound();

          assert.equal(ship.submodules.missileLauncher.targets[0].distance, 4, 'should decrease distance by 1 unit');
          assert.equal(ship.submodules.missileLauncher.targets[1].distance, 2, 'should decrease distance by 1 unit');
        });

        it('should hit target when missile distance reaches 0', () => {

        });

      });

    });

  });

  describe('crew', () => {

    it('should have a crew property', () => {
      assert.isObject(ship.crew, 'should have a crew property');
    });

    describe('engineer', () => {

      it('should have an engineer', () => {
        assert.isObject(ship.crew.engineer, 'should have an engineer');
      });

      describe('assignEngineer', () => {

        it('should be defined', () => {
          assert.isFunction(ship.assignEngineer, 'should define function');
        });

        it('should default engineer to no assigned submodule', () => {
          assert.isNull(ship.crew.engineer.assignedSubmodule, 'should default engineer to no submodule');
        });

        ['shield', 'missileLauncher'].forEach((submodule) => {
          it('should assign engineer to submodule: ' + submodule, () => {
            ship.assignEngineer(submodule);

            assert.equal(ship.crew.engineer.assignedSubmodule, submodule, 'should move engineer to assigned submodule');
          });
        });

        it('should only allow the engineer to be assigned once per round', () => {
          ship.assignEngineer('shield');
          ship.assignEngineer('missileLauncher');

          assert.equal(ship.crew.engineer.assignedSubmodule, 'shield', 'should wait until next round to allow second assingment');
        });

        it('should allow the engineer to be assigned after a round has passed', () => {
          ship.assignEngineer('shield');
          ship.nextRound();
          ship.assignEngineer('missileLauncher');

          assert.equal(ship.crew.engineer.assignedSubmodule, 'missileLauncher', 'should allow second assignment after round');
        });

        it('should unassign the engineer if null is passed', () => {
          ship.assignEngineer('shield');
          ship.nextRound();
          ship.assignEngineer(null);

          assert.isNull(ship.crew.engineer.assignedSubmodule, 'should unassign the engineer');
        });

        it('should throw an exception if an unknown submodule is passed in', () => {
          let test = () => {
            ship.assignEngineer('unknown');
          };

          assert.throws(test, 'Invalid submodule provided');
        });

      });

      describe('submodule repair', () => {

        it('should do nothing if engineer is not assigned', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('missileLauncher');

          ship.nextRound();

          assert.equal(ship.submodules.shield.status, 'DAMAGED', 'should do nothing to submodule status');
          assert.equal(ship.submodules.missileLauncher.status, 'DAMAGED', 'should do nothing to submodule status');
        });

        it('should wait until the next round to repair the submodule', () => {
          ship.damageSubmodule('shield');

          ship.assignEngineer('shield');

          assert.equal(ship.submodules.shield.status, 'DAMAGED', 'should not improve shield status until next round');
        });

        it('should improve a DAMAGED submodule', () => {
          ship.damageSubmodule('missileLauncher');
          ship.damageSubmodule('shield');
          ship.assignEngineer('shield');

          ship.nextRound();

          assert.equal(ship.submodules.shield.status, 'OK', 'should improve shield status');
          assert.equal(ship.submodules.missileLauncher.status, 'DAMAGED', 'should do nothing to missileLauncher status');
        });

        it('should improve a DESTROYED submodule', () => {
          ship.damageSubmodule('shield');
          ship.damageSubmodule('shield');
          ship.assignEngineer('shield');

          ship.nextRound();

          assert.equal(ship.submodules.shield.status, 'DAMAGED', 'should do nothing to submodule status');
        });

        it('should do nothing to an OK submodule', () => {
          ship.assignEngineer('shield');

          ship.nextRound();

          assert.equal(ship.submodules.shield.status, 'OK', 'should do nothing to shield status');
        });

        it('should repair a module before any other actions occur in a ship', () => {
          ship.damageShield('front', 10);
          ship.damageSubmodule('shield');
          ship.assignEngineer('shield');

          ship.nextRound();

          assert.equal(ship.submodules.shield.front.hitpoints, 30, 'should repair module before regeneration occurs');
        });

      });

    });

  });

});
