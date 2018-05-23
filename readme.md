# Purpose

Plug n' play playground to experience test-driven development as a team. Two testing frameworks are supported:

* Jest
* Mocha with Sinon/Chai

# I'm already skipping ahead, how do I get going?

Run:
```
(Install node version 6 or greater if you don't already have it: https://nodejs.org/en/download/)
(If you lack git in your commandline, download and unzip from github: https://github.com/aaronbruckner/TDD-Enterprise)

git clone https://github.com/aaronbruckner/TDD-Enterprise.git

(Select your desired testing framework to implement tests in and CD into the directory)
cd TDD-Enterprise/testingFrameworks/<(jest, mochaWithSinon)>

npm install
```

From the framework directory, run ```npm test``` to execute your tests. While TDDing, you will make a failing test, write the
minimal code needed to make it pass, and repeat this process again and again.

```src/Ship.js``` is where you will implement your ship. ```test/ShipSpec.js``` is where you will write the tests to
force your implementation of the class.

Tasks are located in ```tasks.md```. They are grouped into different "epics". Tasks within each epic become increasingly
difficult. All tasks can be implemented reguardless of the testing framework you select.

A short demo of the tools available can be found at ```<desiredTestingFramework>/test/frameworkDemoSpec.js```. Additional resources are located at:

* Jest (test runner, assertion library, mocking library) - https://facebook.github.io/jest/docs/en/getting-started.html
* Mocha (test runner) - https://mochajs.org/
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

# More tips and Aaron's thoughts on TDD

* Good unit tests read top-down like a book. I personally am much more willing to have duplicate code in my unit tests if it
makes it easy to see everything at play in the tests. Avoid having too many helper functions as tracing all this down makes it
harder to determine the environmental state tests are executed in.
* Mocking is only ever additive. If you are setting up positive path mocks in your beforeEach for every test, you are probably
doing it wrong (as you will need to undo your success mocks when testing negative paths). If you ever have to undo a beforeEach
mock in your test, STOP. Do not go down this slippery slope. Take the time to move the conflicting stubs out of beforeEach and
into every test that needs the differing behavior. If you continue to setup, undo, and re-mock behavior, your tests will be very
hard to follow.
* Never have master mocks that handle logic for every test. They usually look like a single mock that has a huge switch function
trying to determine what path is being tested and therefore how it should respond. You might as well not use your mocking library
at this point. Mocks should be setup before every test and external dependencies should be told exactly how to respond given a
certain input. This makes it easy to see assumptions made for external contracts and makes your tests far more understandable.
* Know your contracts. If your code makes a network call to another service, fully understand its contract before
writing tests for it. Curl it, play around with the real service. Do not guess or write tests based on weak understandings. By knowing your
external contracts, you can frequently TDD code that will work perfectly on the first run.
* Don't test private functions. Identify true inputs and outputs of the system. Implementation details should not be tested but its measurable
effects on the system should be. Sometimes internal network calls can seem like internal code however they make great measurable outputs for
your unit test (and they also happen to be external modules that you cannot unit test). Find an easy network library (like Request) that allows
you to assert that your code is making a well-formed request to the service and mock the responses as if they were being returned from the service
itself. Doing this will allow you to unit test every single possible scenario with an external service!
* Projects are complex. We break down large software packages into modules and functions because the entire task is too complex to throw into
a single file. This complexity doesn't disappear when writing tests. While you should avoid stubbing internal modules when ever possible, sometimes
a module is hiding very complex interactions that you don't want to handle in every other module using it. Good examples of complex modules might be
modules that make network calls or store items in a file system. Mocking out low level complexity like this in every module that uses these base modules
will make your tests hard to follow and modify. Sometimes having a well defined contracts for these base modules is easier to test and understand. However you
run the risk of having tests rely on bad mocks if you ever modify these base modules.
