# Rules
* You must always have a failing test before adding a line of code.
* Write the least amount of code to make the test pass (even if it your code is not complete or functionally correct).
* Repeat again and again until the tests have forced you to implement all the tasks including edge cases.
* You may refactor after a passing test if needed so long as you don't change any functionality and all tests still pass.

# Tasks
The following tasks are roughly grouped by epic. Cards within each epic get progressively harder. Some of the more difficult
tasks may require other tasks to be completed first.

## Time

#### Add ability to process a round
There's a lot going on in a ship and it can't all happen at once. Some functionality requires time to pass before it can
be completed. Add a function ```nextRound()``` that will process a round. This will allow future modules to regenerate
shields, heal hitpoints, and move crew members. While it currently won't do anything, later tasks will require passage 
of time for their functionality.

## Hull

#### Add hitpoints property to ship
A ship object should expose a ```hitpoints``` property. It should be initialized to 100.

#### Damage ship
A ship can be damaged. Add a function ```damageShip(damage)``` that harms the ship. This should reduce the ship hitpoints
property by the given "damage" amount. Example:
```
ship.damageShip(25);
console.log(ship.hitpoints); // 75 hitpoints remaining
```

## SubModules - Foundation

#### Add submodules property to ship
A ship object should expose a ```submodules``` property that is an object. Future submodules will be added as key entries
to ship.submodules.

#### Damage submodule
**Start a submodule implementation before attempting this (shield or missile launcher).** Add function 
```damageSubmodule(submodule)``` that damages the provided submodule. A submodule may fire a missile or block damage via a 
shielding effect, but the module itself can be damaged under certain circumstances. A damaged submodule will be less
effective. Each submodule should have a ```status``` property that can be ```OK```, ```DAMAGED```, or ```DESTROYED```.
Damaging a submodule should degrade it's status by one value (```OK``` to ```DAMAGED```, ```DAMAGED``` to ```DESTROYED```).

Example:
```
ship.damageSubmodule('shield');
console.log(ship.submodules.shield.status); // DAMAGED
```

## SubModules - Shield

#### Expose new shield submodule
Add new shield submodule to ship.submodules. Shield submodule should contain four quadrants (front, back, left, right).
Each quadrant should have hitpoints. 

Front should start with 30 hitpoints.
Left and right should start with 15 hitpoints.
Back should start with 10 hitpoints.

Example:
```
console.log(ship.submodules.shield.front.hitpoints); // 30
```

#### Damage shield quadrant
Add a ```damageShield(quadrantKey, damage)``` function that takes a shield quadrant and a damage amount. The function should 
damage the specified shield quadrant on the ship. Note that this is not damaging the shield module itself but the shields
it is generating. A shield quadrant's hitpoints should not drop below zero. Any unabsorbed damage should be returned 
from the function like this:
```
var damage = ship.damageShield('front', 50);
console.log(damage); // Should be 20
```

#### Calculate shield percentage
Add a ```calculateShieldPercentage(quadrantKey)``` function that takes a shield quadrant and returns the percentage of 
shield remaining (0 - 100).

Example: 
```
ship.damageShield('front', 15);
console.log(ship.calculateShieldPercentage('front')); // 50
```

#### Shield regeneration
With each passing round, a single quadrant can be healed by 10 hitpoints (5 hitpoints if shield is DAMAGED). A shield 
quadrant that was brought to zero hitpoints cannot absorb any damage until 100% recharged. Shield regeneration should 
pick the quadrant with the lowest hitpoints to regenerate each round. If a broken quadrant is chosen, it should be healed 
for every round thereafter until brought to 100%.

#### Shield collapsed! 
The shield can only take so much abuse. Once two quadrants break, the remaining shield quadrants are no longer effective.
If two or more quadrants are broken (zero hitpoints or reached zero hitpoints and is being recharged) no damage can be 
absorbed by the remaining quadrants.

#### Shield destroyed! 
**Implement the Engineer before completing this.** If the shield submodule is damaged and its status becomes ```DESTROYED```,
all shield quadrants should drop to zero and become broken. Shield regeneration should be disabled until status is 
elevated to ```DAMAGED```.

## SubModules - Missile Launcher

#### Add missile launcher submodule
A ship cant fire missiles without a missile launcher. Add the ```missileLauncher``` submodule.

#### Launch missile at target
Add function ```fireMissile(target)```. When called, the ship fires a missile at the target (which was passed in as a 
parameter). The target parameter is an object that has a distance, an id that uniquely identifies it, and a function 
called ```hit```. There can be multiple missiles in-flight.

#### Missile moves towards target and damages it
Missiles take time to reach their target. With each passing round, all missiles in flight move 1 distance unit towards 
their targets. When a missile reaches its target, it should invoke the ```hit``` function on the target.

#### Damaged missiles launchers are dangerous
Sometimes you just can't wait to do the right thing in a space battle. If the ```missileLauncher``` submodule is 
```DAMAGED```, firing it deals 1 point of damage to the ship.

#### Destroyed missile launchers are useless
Even in dire straights, destroyed is destroyed. The ```missileLauncher``` cannot be fired when ```DESTROYED```.

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