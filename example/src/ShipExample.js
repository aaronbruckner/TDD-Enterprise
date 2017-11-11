'use strict';

/**
 * DO NOT LOOK AT THIS UNTIL COMPLETING THE PROJECT!!! This is my personal ship implementation from all the tasks.
 *
 * @author Aaron Bruckner
 */

const SHIELD_QUADRANTS = {
  front: {
    MAX: 30
  },
  back: {
    MAX: 10
  },
  left: {
    MAX: 15
  },
  right: {
    MAX: 15
  }
};

class ShipExample {
  constructor() {
    this.hitpoints = 100;
    this.submodules = {
      shield: {
        status: 'OK',
        front: {
          hitpoints: SHIELD_QUADRANTS.front.MAX
        },
        back: {
          hitpoints: SHIELD_QUADRANTS.back.MAX
        },
        left: {
          hitpoints: SHIELD_QUADRANTS.left.MAX
        },
        right: {
          hitpoints: SHIELD_QUADRANTS.right.MAX
        }
      }
    };
  }

  calculateShieldPercentage(quadrantKey) {
    if (!Object.keys(SHIELD_QUADRANTS).includes(quadrantKey)) {
      throw new Error('Invalid shield quadrant provided');
    }

    return Math.round(this.submodules.shield[quadrantKey].hitpoints / SHIELD_QUADRANTS[quadrantKey].MAX * 100);
  }

  damageShip(damage) {
    this.hitpoints = Math.max(this.hitpoints - damage, 0);
  }

  damageShield(quadrantKey, damage) {
    if (!['front', 'back', 'left', 'right'].includes(quadrantKey)) {
      throw new Error('Invalid shield quadrant provided');
    }

    let quadrant = this.submodules.shield[quadrantKey];

    if (quadrant.broken) {
      return damage;
    }

    let hitpoints = quadrant.hitpoints - damage;
    quadrant.hitpoints = Math.max(hitpoints, 0);
    return hitpoints < 0 ? Math.abs(hitpoints) : 0;
  }

  damageSubmodule(submodule) {
    if (!this.submodules[submodule]) {
      throw new Error('Invalid submodule provided');
    }

    this.submodules[submodule].status = this.submodules[submodule].status === 'OK' ? 'DAMAGED' : 'DESTROYED';
  }

  nextRound() {
    let self = this;

    function regenerateShield() {
      let lowestQuadrant, lowestQuadrantKey = null;
      let quadrantKeys = Object.keys(SHIELD_QUADRANTS);

      for (let i = 0; i < quadrantKeys.length; i++) {
        let quadrantKey = quadrantKeys[i];
        let quadrant = self.submodules.shield[quadrantKey];

        if (quadrant.broken) {
          lowestQuadrant = quadrant;
          lowestQuadrantKey = quadrantKey;
          break;
        }

        if (!lowestQuadrant || (quadrant.hitpoints < lowestQuadrant.hitpoints && quadrant.hitpoints < SHIELD_QUADRANTS[quadrantKey].MAX)) {
          lowestQuadrant = quadrant;
          lowestQuadrantKey = quadrantKey;

          if (lowestQuadrant.hitpoints === 0) {
            // Broken shield, continue to heal until full.
            lowestQuadrant.broken = true;
          }
        }
      }

      if (lowestQuadrant) {
        let hitpointsToRegen = self.submodules.shield.status === 'OK' ? 10 : 5;
        let quadrantMax = SHIELD_QUADRANTS[lowestQuadrantKey].MAX;
        lowestQuadrant.hitpoints = Math.min(lowestQuadrant.hitpoints + hitpointsToRegen, quadrantMax);

        if (lowestQuadrant.hitpoints === quadrantMax) {
          // Release broken quadrant if fully healed.
          delete lowestQuadrant.broken;
        }
      }
    }

    regenerateShield();
  }



}

module.exports = ShipExample;