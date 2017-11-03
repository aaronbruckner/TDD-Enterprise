'use strict';

/**
 * DO NOT LOOK AT THIS UNTIL COMPLETING THE PROJECT!!! This is my personal ship implementation from all the tasks.
 *
 * @author Aaron Bruckner
 */

const SHIELD_MAX = {
  front: 30,
  back: 10,
  left: 15,
  right: 15
};

class ShipExample {
  constructor() {
    this.hitpoints = 100;
    this.submodules = {
      shield: {
        status: 'OK',
        front: {
          hitpoints: SHIELD_MAX.front
        },
        back: {
          hitpoints: SHIELD_MAX.back
        },
        left: {
          hitpoints: SHIELD_MAX.left
        },
        right: {
          hitpoints: SHIELD_MAX.right
        }
      }
    };
  }

  calculateShieldPercentage(quadrant) {
    if (!['front', 'back', 'left', 'right'].includes(quadrant)) {
      throw new Error('Invalid shield quadrant provided');
    }

    return Math.round(this.submodules.shield[quadrant].hitpoints / SHIELD_MAX[quadrant] * 100);
  }

  damageShip(damage) {
    this.hitpoints = Math.max(this.hitpoints - damage, 0);
  }

  damageShield(quadrant, damage) {
    if (!['front', 'back', 'left', 'right'].includes(quadrant)) {
      throw new Error('Invalid shield quadrant provided');
    }

    let hitpoints = this.submodules.shield[quadrant].hitpoints - damage;
    this.submodules.shield[quadrant].hitpoints = Math.max(hitpoints, 0);
    return hitpoints < 0 ? Math.abs(hitpoints) : 0;
  }

  damageSubmodule(submodule) {
    if (!this.submodules[submodule]) {
      throw new Error('Invalid submodule provided');
    }

    this.submodules[submodule].status = this.submodules[submodule].status === 'OK' ? 'DAMAGED' : 'DESTROYED';
  }

  tick() {

  }

}

module.exports = ShipExample;