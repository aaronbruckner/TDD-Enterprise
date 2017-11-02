'use strict';

/**
 * DO NOT LOOK AT THIS UNTIL COMPLETING THE PROJECT!!! This is my personal ship implementation from all the tasks.
 *
 * @author Aaron Bruckner
 */
class ShipExample {
  constructor() {
    this.hitpoints = 100;
    this.submodules = {
      shield: {
        front: {
          hitpoints: 30
        },
        back: {
          hitpoints: 10
        },
        left: {
          hitpoints: 15
        },
        right: {
          hitpoints: 15
        }
      }
    };
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

}

module.exports = ShipExample;