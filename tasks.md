# Rules
* You must always have a failing tests before adding a line of code.

# Tasks
The following tasks are roughly grouped by epic. Cards within each epic get progressively harder. Some of the more difficult
tasks may require other tasks to be completed first.

## Hull

### Add hitpoints property to ship
A ship object should expose a ```hitpoints``` property. It should be initialized to 100.

### Damage ship
A ship can be damaged. Add a function ```damageShip(damage)``` that harms the ship.

## SubModules - Foundation

#### Add submodules property to ship
A ship object should expose a ```submodules``` property that is an object. Future submodules will be added as key entries
to ship.submodules.

#### Damage submodule (Implement one submodule first)
Add function ```damageSubmodule(submodule)``` that damages provided submodule. Each submodule should have a ```status```
property that can be ```OK```, ```DAMAGED```, or ```DESTROYED```. Damaging a submodule should degrade it's status by 
one value (OK to DAMAGED, DAMAGED to DESTROYED). Damaging a DESTROYED module should do nothing.

## SubModules - Shield

#### Expose new shield submodule
Add new shield submodule to ship.submodules. Shield submodule should contain four quadrants (front, back, left, right).
Each quadrant should have hitpoints. 

Front should start with 30 hitpoints.
Left and right should start with 15 hitpoints.
Back should start with 10 hitpoints.

#### Damage shield quadrant
Add a ```damageShield(quadrant, damage)``` function that takes a shield quadrant and a damage amount. The function should damage the specified
shield quadrant on the ship. A shield quadrant's hitpoints should not drop below zero. Any unabsorbed damage should be
returned from the function.

#### Calculate shield percentage
Add a ```calculateShieldPercentage(quadrant)``` function that takes a shield quadrant and returns the percentage of 
shield remaining (0 - 100).

#### Display shield status
Add status property to shield submodule. Status should be "OK" with zero broken shield quadrants, "DAMAGED" with one broken
quadrant, and "DESTROYED"

#### Shield regeneration
With each passing round, a single quadrant can be healed by 10 hitpoints (5 hitpoints if shield is DAMAGED). A shield 
quadrant that was brought to zero hitpoints cannot absorb any damage until 100% recharged. Shield regeneration should 
pick the quadrant with the lowest hitpoints to regenerate each round. If a broken quadrant is chosen, it should be healed 
for every round thereafter until brought to 100%.

#### Shield collapsed! 
The shield can only take so much abuse. Once two quadrants collapse, the remaining shield quadrants are no longer effective.
If two or more quadrants are down, no damage can be absorbed by the shields.

#### Shield destroyed! 
If the shield submodule is damaged and its status becomes ```DESTROYED```, all shield quadrants should drop to zero and 
become broken. Shield regeneration should be disabled until status is elevated to ```DAMAGED```

## SubModules - Missile Launcher

#### Add missile launcher submodule
A ship cant fire missiles without a missile launcher. Add the ```missileLauncher``` submodule.

#### Launch missile at target
Add function ```fireMissile(target)``` to launch a missile at the target. The target has a distance, and id that identifies,
it, and a function called ```hit```. 

#### Damaged missiles launchers are dangerous
Sometimes you just can't wait to do the right thing in a space battle. If the ```missileLauncher``` submodule is 
```DAMAGED```, firing it deals 1 point of damage to the ship.

#### Destroyed missile launchers are useless
Even in dire straights, destroyed is destroyed. The ```missileLauncher``` cannot be fired when ```DESTROYED```.

#### Missile moves towards target and damages it
Missiles take time to reach their target. With each passing round, all missiles in flight move 1 distance unit towards 
their targets. When a missile reaches its target, it should invoke the ```hit``` function on the target.

#### Target destroyed before missile reaches it
When the ```target.hit``` function is invoked, it will return ```true``` if the hit destroyed the target. Any remaining
missiles that are flying towards the target will miss and should not invoke the target.hit function.

## Crew - Engineer

#### Assign Engineer to submodule
The Engineer can move about the ship to repair ```DAMAGED``` or ```DESTROYED``` submodules. Add function 
```assignEngineer(submodule)``` that moves the engineer to the submodule. Passing ```null``` should unassign the
Engineer. After assignment, a round must pass before the Engineer can move again.

#### Repair damaged submodules
When the Engineer is assigned to a submodule, when a round passes he can improve the status of the submodule by one 
rank (```DESTROYED``` to ```DAMAGED``` to ```OK```). The Engineer can only repair the module he is assigned to.