let sinon = require('sinon');
let assert = require('chai').assert;

/**
 * This file shows off how to get started with the tools provided in this project.
 */
describe('Testing framework Demo', () => {

  /**
   * Docs: https://mochajs.org/
   */
  describe('mocha is your test runner', () => {

    let myTestVariable;

    beforeEach(() => {
      // Do something before every test in here
      myTestVariable = 'isolatedTestVariables';
    });

    afterEach(() => {
      // Clean up after every test here
    });

    describe('use describe to organize groups of related tests', function () {

      it('this test is in its own block', () => {

      });

    });

    it ('This is a synchronous test', () => {
      assert.isTrue(true, 'should always pass');
    });

    it('this is an asynchronous test', function (done) {
      setTimeout(() => {
        // Invoke done when your test is complete.
        done();
      });
    });
  });

  /**
   * Docs: http://chaijs.com/api/assert/
   */
  describe('chai is your assertion library', () => {

    it('has lots of useful assertion functions', function () {

      assert.isTrue(true, 'should be true');
      assert.isFalse(false, 'should be false');
      assert.equal(1, 1, 'should be equal');

      assert.isNull(null, 'should be null');
      assert.isFunction(() => {}, 'should be a function');
      assert.isObject({}, 'should be an object');

      let shouldThrowException = () => {
        throw new Error('should throw an exception');
      };
      assert.throws(shouldThrowException, 'should throw an exception');
    });

  });

  /**
   * Docs: http://sinonjs.org/releases/v4.0.2/
   */
  describe('sinon is your spy/stub/mocking library', () => {

    it('has useful spies', function () {
      let spy = sinon.spy();

      spy('one');

      assert.isTrue(spy.called, 'should call spy');
      assert.isTrue(spy.calledOnce, 'should call spy once');
      assert.equal(spy.callCount, 1, 'should call spy once');
      assert.isTrue(spy.calledWith('one'), 'should invoke spy with the correct parameter');
      assert.isTrue(spy.calledWith(sinon.match.string), 'should invoke spy with any string');
    });

    it('has useful stubs', function () {
      let myObject = {
        hello: () => {
          return 'hello';
        }
      };

      sinon.stub(myObject, 'hello');
      myObject.hello.returns('stubbed hello');
      assert.equal(myObject.hello(), 'stubbed hello', 'should return stubbed value');

      myObject.hello.throws('hello exception!');
      assert.throws(myObject.hello);

      // Don't forget to restore that live outside the test. The best place to do this is in afterEach.
      myObject.hello.restore();
    });

  });

});