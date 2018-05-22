# Rules
* You must always have a failing test before adding a line of code. Run it and see it fail!
* Write the least amount of code to make the test pass (even if it your code is not complete or functionally correct).
* Repeat again and again until the tests have forced you to implement all the tasks including edge cases.
* You may refactor after a passing test if needed so long as you don't change any functionality and all tests still pass.
* Avoid exposing private functions to test, try to assert functionality by only calling public functions on the ship class.
* Pair up with a partner if possible. Work together and switch who is driving every so often. The person watching should
always be challenging the driver to write less (functional) code that still makes their current test case pass. 

# Tasks
The following tasks are roughly grouped by epic. Cards within each epic get progressively harder. Some tasks may require 
other tasks to be completed first.

## 1 - Time

#### 1.1 - Add ability to process a round
There's a lot going on in a ship and it can't all happen at once. Some functionality requires time to pass before it can
be completed. Add a function ```nextRound()``` that will process a round. This will allow future modules to regenerate
shields, heal hitpoints, and move crew members. While it currently won't do anything, later tasks will require passage
of time for their functionality.

## 2 - Hull

#### 2.1 - Add hitpoints property to ship
A ship object should expose a ```hitpoints``` property. It should be initialized to 100.

#### 2.2 - Damage ship
A ship can be damaged. Add a function ```damageShip(damage)``` that harms the ship. This should reduce the ship hitpoints
property by the given "damage" amount.

Example:
```
ship.damageShip(25);
console.log(ship.hitpoints); // 75 hitpoints remaining
```

## 3 - SubModule Foundation

#### 3.1 - Add submodules property to ship
A ship object should expose a ```submodules``` property that is an object. Future submodules will be added as key entries
to ship.submodules.

#### 3.2 - Damage submodule (Depends on items 4 or 5)
**Start a submodule implementation before attempting this (shield or missile launcher).** Add function
```damageSubmodule(submodule)``` that damages the provided submodule. A submodule may fire a missile or block damage via a
shielding effect, but the module itself can be damaged under certain circumstances. A damaged submodule will be less
effective.

* Each submodule should have a ```status``` property that can be ```OK```, ```DAMAGED```, or ```DESTROYED```.
* Damaging a submodule should degrade it's status by one value (```OK``` to ```DAMAGED```, ```DAMAGED``` to ```DESTROYED```).

Example:
```
ship.damageSubmodule('shield');
console.log(ship.submodules.shield.status); // DAMAGED
```

## 4 - Shield Submodule
Implementation of the shield module provides lots of opportunities to test and catch growing egde cases as your submodule
becomes more and more complex.

#### 4.1 - Expose new shield submodule
Add new shield submodule to ship.submodules. Shield submodule should contain four quadrants (front, back, left, right).
Each quadrant should have hitpoints.

* Front should start with 30 hitpoints.
* Left and right should start with 15 hitpoints.
* Back should start with 10 hitpoints.

Example:
```
console.log(ship.submodules.shield.front.hitpoints); // 30
```

#### 4.2 - Damage shield quadrant
Add a ```damageShield(quadrantKey, damage)``` function that takes a shield quadrant and a damage amount. The function should
damage the specified shield quadrant on the ship.

* Note that this is not damaging the shield module itself but the shields it is generating.
* A shield quadrant's hitpoints should not drop below zero.
* Any unabsorbed damage should be returned from the function like this:
```
var damage = ship.damageShield('front', 50);
console.log(damage); // Should be 20
```

#### 4.3 - Calculate shield percentage
Add a ```calculateShieldPercentage(quadrantKey)``` function that takes a shield quadrant and returns the percentage of
shield remaining (0 - 100).

Example:
```
ship.damageShield('front', 15);
console.log(ship.calculateShieldPercentage('front')); // 50
```

#### 4.4 - Shield regeneration
With each passing round, a quadrant can be regenerated.

* A single quadrant can be healed by 10 hitpoints (5 hitpoints if shield is DAMAGED) per round.
* A shield quadrant that was brought to zero hitpoints cannot absorb any damage until 100% recharged.
* Shield regeneration should pick the quadrant with the lowest hitpoints to regenerate each round.
* If a broken quadrant is chosen (reached 0 hitpoints), it should be healed for every round thereafter until brought to 100%.

#### 4.5 - Shield collapsed!
The shield can only take so much abuse. Once two quadrants break, the remaining shield quadrants are no longer effective.

* If two or more quadrants are broken (zero hitpoints or reached zero hitpoints and is being recharged) no damage can be
absorbed by the remaining quadrants.

#### 4.6 - Shield destroyed! (Requires 3.2, 6, and 7)
**Implement the Engineer before starting this.** If the shield submodule is damaged and its status becomes ```DESTROYED```,
all shield quadrants should drop to zero and become broken. Shield regeneration should be disabled until status is
elevated to ```DAMAGED```.

## 5 - Missile Launcher SubModule
Implementing the missile launcher provides practice with testing code that invokes external dependencies. How these external
dependencies are utilized by the module under test makes for great unit tests. 

#### 5.1 - Add missile launcher submodule
A ship cant fire missiles without a missile launcher. Add the ```missileLauncher``` submodule.

#### 5.2 - Launch missile at target
Add function ```fireMissile(target)``` to the ship. Active missile targets should be tracked under ship.submodules.missileLauncher.targets

* When called, the ship fires a missile at the target (which was passed in as a parameter).
* The target parameter is an object that has a distance, an id that uniquely identifies it, and a function called ```hit```.
* Target objects with the same id represent the same enemy ship.
* There can be multiple missiles in-flight.

Example:
```
ship.fireMissile({
    // Possible target object that could be passed into ship.fireMissile
    id: 'enemyShip1',
    distance: 5,
    hit: () => {
        console.log('Target "enemyShip1"' was hit);
        return Math.random() >= 0.5; // 50% chance ship is destroyed. See task: "Target destroyed before missile reaches it".
    }
});
```

#### 5.3 - Missile moves towards target and damages it
Missiles take time to reach their target. With each passing round, they get closer until they hit the target.

* All missiles in flight move 1 distance unit towards their targets per round.
* When a missile reaches its target, it hits it.
* When a target is hit, you should invoke the ```hit``` function on the target object that was provided when originally
invoking ```ship.fireMissile```.

#### 5.4 - Damaged missiles launchers are dangerous (Requires 3.2)
Sometimes you just can't wait to do the right thing in a space battle. If the ```missileLauncher``` submodule is
```DAMAGED```, firing it deals 1 point of damage to the ship.

#### 5.5 - Destroyed missile launchers are useless (Requires 3.2)
Even in dire straights, destroyed is destroyed. The ```missileLauncher``` cannot be fired when ```DESTROYED```.

#### 5.6 - Target destroyed before missile reaches it
Things tend to blow up when hit with missiles. The ```hit``` function on the target object returns a boolean. If false,
the target survived the hit. If true, the target was destroyed by the missile.

* When a target is destroyed, any remaining missiles that are flying towards the same target will miss
(target objects with matching ids are the same).
* Missiles that miss their target should not invoke the ```target.hit``` function.

## 6 - Crew Foundation

#### 6.1 - Ship should have a crew
Ships can't run without a crew (yet). Add object property ```crew``` to the ship that will contain the different
members running the ship.

## 7 - Engineer Crew Member

#### 7.1 - Add the Engineer
Add the Engineer to the ship's crew.

#### 7.2 - Assign Engineer to submodule
The Engineer can move about the ship to repair ```DAMAGED``` or ```DESTROYED``` submodules.

* Add function ```assignEngineer(submodule)``` that moves the engineer to the submodule.
* Passing ```null``` should unassign the Engineer.
* After assignment, a round must pass before the Engineer can move again.

#### 7.3 - Repair damaged submodules (Requires 3.2)
If the Engineer is assigned to a submodule, when a round passes he can improve the status of the submodule by one
rank (```DESTROYED``` to ```DAMAGED``` to ```OK```). The Engineer can only repair the module he is assigned to.

# In Development (working on adding new content!)
## 8 - Deep Space Comm Net
Adding a communication network to your ship allows you to practice mocking out network calls & time. Understanding
external APIs that you will be making requests to is vital for writing effective, valid unit tests. You should avoid
TDDing until you fully understand the contracts your mocks should adhere to.

#### Set Ship Position

#### Set Ship Call Sign

#### Report Ship Location & Status
Add function ```reportIn(callback)``` that 

#### Scan for New Contacts
Add function ```scanForContacts(range, callback)```. This function should poll the list of reported ships 3 times with a 
10 second gap between each call. After 3 checks have been made, the callback property should be invoked with a single 
array of contacts. Contacts in this array should only contain ships that are within euclidean range of this ship's
current position.

The API for getting a list of contacts with their callsigns and positions is:
```
Endpoint: GET https://<serviceUrl>/contacts

Response Body:
    [
        // Contact 1
        {
            "callSign": "zulu",
            "x": 32,
            "y": -40
        },
        ... addition contacts
    ]
```

The array returned from ```GET /contacts``` can be empty.

Once polling has completed and in range contacts have bene found, the callback should be invoked once like:

```
callback([
    {
        "callSign": "zulu",
        "x": 32,
        "y": -40
    },
    ... // Other contacts that were within 
])
```

#### Order New Contacts by Proximity