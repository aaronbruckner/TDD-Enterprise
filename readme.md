# Purpose

Plug n' play playground to experience test-driven development as a team.

# I'm already skipping ahead, how do I get going?

Run: 
```
git clone https://github.com/aaronbruckner/TDD-Enterprise.git
cd TDD-Enterprise/
npm install
```

From the project root, run ```npm test``` to execute your tests. While TDDing, you will make a failing test, write the
minimal code needed to make it pass, and repeat this process again and again.

```src/Ship.js``` is where you will implement your ship. ```test/ShipSpec.js``` is where you will write the tests to
force your implementation of the class.

Tasks are located in ```tasks.md```. They are grouped into different "epics". Tasks within each epic become increasingly
difficult.

A short demo of the tools available can be found at ```test/frameworkDemoSpec.js```. Additional resources are located at:

* Chai (assertion library) - http://chaijs.com/api/assert/
* Sinon (mocking library) - http://sinonjs.org/releases/v4.0.2/

# How do I TDD?

At a minimum, not a single line of code before a failing test. Period. It's going to be really hard at first. As engineers,
we see the solution 5 steps ahead and run towards it. 

For this exercise, the tests should force you to write the code. You should consistently try to implement the least amount
of code to see green tests (even if what you have isn't functionally correct or complete).

For example, lets say we want to TDD an addition function.

```
function add(a, b) {

}
```

One of the first tests we'd probably write could be something like:
```
it('should add two numbers together', () => {
  assert.equal(add(10, 5), 15, 'should add two numbers correctly');
});
```

With this first test it would be very easy to implement the following:
```
function add(a, b) {
  return a + b;
}
```

This will indeed make the test pass, but is it the minimal code needed to make our single test pass? 

What about this?
```
function add(a, b) {
  return 15;
}
```

You and your teammates should work together and challenge each other to let the code be a consequence of the tests.
If you are not already a test-driven developer, it's my hope that this exercise will give you an opportunity to feel
the predictive nature of writing tests before code. It will be a major hindrance at first. You'll be frustrated
that you are wasting time creating lackluster tests. However, if you stick with it, the first piece of serious code you push
to production that works perfectly feels amazing. It's almost magical. Code that you created with tests that works the
first time you run it? At that point you've turned the development cycle upside down.

And that's pretty damn cool.

Aaron