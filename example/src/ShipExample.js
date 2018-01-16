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

/**
* Constructs a ship. Ships have weapons, crew, and shields.
* @constructor
*/
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
      },
      missileLauncher: {
        status: 'OK',
        targets: []
      }
    };
    this.crew = {
      engineer: {
        assignedSubmodule: null,
        assignedThisRound: false
      }
    };
  }

  /**
  * Checks a shield quadrant's remaining shield percentage.
  *
  * @param {string} quadrantKey - the shield quadrant to calculate percentage for.
  * @returns a whole number (0-100) representing the percentage of remaining shield for the given quadrantKey
  */
  calculateShieldPercentage(quadrantKey) {
    if (!Object.keys(SHIELD_QUADRANTS).includes(quadrantKey)) {
      throw new Error('Invalid shield quadrant provided');
    }

    return Math.round(this.submodules.shield[quadrantKey].hitpoints / SHIELD_QUADRANTS[quadrantKey].MAX * 100);
  }

  /**
  * If the ship is under fire, its hull can be damaged. Removes hitpoints from the ship.
  * A ship's hitpoints cannot drop below zero.
  *
  * @param {number} damage - the total damage to deal to the ship.
  */
  damageShip(damage) {
    this.hitpoints = Math.max(this.hitpoints - damage, 0);
  }

  /**
  * Damages a specific shield quadrant (front, back, left, right) by the provided damage.
  *
  * @param {string} quadrantKey - the shield quadrant to apply the damage to.
  * @param {number} damage - the total damage to deal to the ship.
  * @returns {number} - any damage that is not absorbed by the shield is returned. If all damage is absorbed, 0 is returned.
  */
  damageShield(quadrantKey, damage) {
    if (!Object.keys(SHIELD_QUADRANTS).includes(quadrantKey)) {
      throw new Error('Invalid shield quadrant provided');
    }

    let totalBrokenQuadrants = 0;
    Object.keys(SHIELD_QUADRANTS).forEach((quadrantKey) => {
      let quadrant = this.submodules.shield[quadrantKey];
      if (quadrant.hitpoints === 0 || quadrant.broken) {
        totalBrokenQuadrants++;
      }
    });

    if (totalBrokenQuadrants >= 2) {
      return damage;
    }


    let quadrant = this.submodules.shield[quadrantKey];

    if (quadrant.broken) {
      return damage;
    }

    let hitpoints = quadrant.hitpoints - damage;
    quadrant.hitpoints = Math.max(hitpoints, 0);
    return hitpoints < 0 ? Math.abs(hitpoints) : 0;
  }

  /**
  * Submodules can be damaged or destroyed in combat. Damaged submodules are less effective.
  * This degrades the submodule by one status (OK -> DAMAGED, DAMAGED -> DESTROYED). This has no
  * effect on destroyed submodules.
  *
  * @param {string} submodule - the name of the submodule to damage.
  */
  damageSubmodule(submodule) {
    if (!this.submodules[submodule]) {
      throw new Error('Invalid submodule provided');
    }

    this.submodules[submodule].status = this.submodules[submodule].status === 'OK' ? 'DAMAGED' : 'DESTROYED';

    if (this.submodules.shield.status === 'DESTROYED') {
      Object.keys(SHIELD_QUADRANTS).forEach((quadrantKey) => {
        this.submodules.shield[quadrantKey].hitpoints = 0;
      });
    }
  }

  /**
  * The engineer can repair damaged or destroyed submodules. To do so he first must
  * be assigned to a submodule. Repairs occur every round. An engineer can only be
  * moved once per round. Any additional assignemts before the round passes will be ignored.
  *
  * @param {string} submodule - the name of the submodule to move the engineer to.
  */
  assignEngineer(submodule) {
    if (submodule !== null && !this.submodules[submodule]) {
      throw new Error('Invalid submodule provided');
    }

    if (this.crew.engineer.assignedThisRound) {
      return;
    }

    this.crew.engineer.assignedThisRound = true;
    this.crew.engineer.assignedSubmodule = submodule;
  }

  /**
  * Launches a missle at the target.
  * @param {object} target - the target to launch a missle at.
  * @param {string} target.id - the unique identifier for the target. Multiple targets with the same id are targetting the
  *                             same physical enemy.
  * @param {number} target.distance - indicates how far away the missile is from the target.
  * @param {function} target.hit - function to invoke once the missile reaches its target.
  */
  fireMissile(target) {
    if (this.submodules.missileLauncher.status === 'DAMAGED') {
      this.damageShip(1);
    }
    if (this.hitpoints > 0) {
      this.submodules.missileLauncher.targets.push(target);  
    }
  }

  /**
  * Time must pass for certian actions to occur. They are all processed here.
  */
  nextRound() {
    let self = this;

    function repairSubmodule() {
      let assignedSubmodule = self.crew.engineer.assignedSubmodule;
      if (assignedSubmodule) {
          self.submodules[assignedSubmodule].status = self.submodules[assignedSubmodule].status === 'DESTROYED' ? 'DAMAGED' : 'OK';
      }
    }

    function regenerateShield() {
      if (self.submodules.shield.status === 'DESTROYED') {
        return;
      }

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

    function moveMissiles() {
      let i = 0;
      while(i < self.submodules.missileLauncher.targets.length) {
        let target = self.submodules.missileLauncher.targets[i];
        if (--target.distance === 0) {
          target.hit();
          self.submodules.missileLauncher.targets.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    repairSubmodule();
    regenerateShield();
    moveMissiles();

    this.crew.engineer.assignedThisRound = false;
  }
}

module.exports = ShipExample;
