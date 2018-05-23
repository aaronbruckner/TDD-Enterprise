const moduleUnderTest = require('../src/stubExamples/moduleUnderTest');
const ComplexClassWithBadConstructor = require('../src/stubExamples/ComplexClassWithBadConstructor');

/**
 * This file shows off how to get started with the tools provided in this project.
 */
describe('Testing framework Demo', () => {
  test('should have examples of jest testing', () => {
    // TODO: Add jest examples similar to mocha/sinon
  });
  // /**
  //  * Docs: https://mochajs.org/
  //  */
  // describe('mocha is your test runner', () => {
  //
  //   let myTestVariable;
  //
  //   beforeEach(() => {
  //     // Do something before every test in here
  //     myTestVariable = 'isolatedTestVariables';
  //   });
  //
  //   afterEach(() => {
  //     // Clean up after every test here
  //   });
  //
  //   describe('use describe to organize groups of related tests', function () {
  //
  //     it('this test is in its own block', () => {
  //
  //     });
  //
  //   });
  //
  //   it ('This is a synchronous test', () => {
  //     assert.isTrue(true, 'should always pass');
  //   });
  //
  //   it('this is an asynchronous test', function (done) {
  //     setTimeout(() => {
  //       // Invoke done when your test is complete.
  //       done();
  //     });
  //   });
  // });
  //
  // /**
  //  * Docs: http://chaijs.com/api/assert/
  //  */
  // describe('chai is your assertion library', () => {
  //
  //   it('has lots of useful assertion functions', function () {
  //
  //     assert.isTrue(true, 'should be true');
  //     assert.isFalse(false, 'should be false');
  //     assert.equal(1, 1, 'should be equal');
  //
  //     assert.isNull(null, 'should be null');
  //     assert.isFunction(() => {}, 'should be a function');
  //     assert.isObject({}, 'should be an object');
  //
  //     let shouldThrowException = () => {
  //       throw new Error('should throw an exception');
  //     };
  //     assert.throws(shouldThrowException, 'should throw an exception');
  //   });
  //
  // });
  //
  // /**
  //  * Docs: http://sinonjs.org/releases/v4.0.2/
  //  */
  // describe('sinon is your spy/stub/mocking library', () => {
  //
  //   it('has useful spies', function () {
  //     let spy = sinon.spy();
  //
  //     spy('one');
  //
  //     assert.isTrue(spy.called, 'should call spy');
  //     assert.isTrue(spy.calledOnce, 'should call spy once');
  //     assert.equal(spy.callCount, 1, 'should call spy once');
  //     assert.isTrue(spy.calledWith('one'), 'should invoke spy with the correct parameter');
  //     assert.isTrue(spy.calledWith(sinon.match.string), 'should invoke spy with any string');
  //   });
  //
  //   it('has useful stubs', function () {
  //     let myObject = {
  //       hello: () => {
  //         return 'hello';
  //       }
  //     };
  //
  //     sinon.stub(myObject, 'hello');
  //     myObject.hello.returns('stubbed hello');
  //     assert.equal(myObject.hello(), 'stubbed hello', 'should return stubbed value');
  //
  //     myObject.hello.throws('hello exception!');
  //     assert.throws(myObject.hello);
  //
  //     // Don't forget to restore that live outside the test. The best place to do this is in afterEach.
  //     myObject.hello.restore();
  //   });
  //
  // });
  //
  // /**
  //  * This shows some common stubbing you may have to do while unit testing.
  //  */
  // describe('stub scenarios', () => {
  //
  //   describe('working with classes', () => {
  //
  //     /**
  //      * Sometimes functions under test create new instances of external modules. Controlling their behavior can be
  //      * helpful in determining if your module under test handles all possible cases (like exceptions or errors thrown
  //      * by the external dependency. Sometimes these dependent objects do things in their constructors that you want
  //      * to prevent in unit tests for other modules.
  //      */
  //     it('override method behavior on an instance of a class', () => {
  //       class MyClass {
  //         constructor() {
  //
  //         }
  //         getInt() {
  //           return 1;
  //         }
  //       }
  //
  //       // You must target the class' prototype to mock an instance's behavior when the function is invoked. MyClass
  //       // constructor will still be invoked.
  //       sinon.stub(MyClass.prototype, 'getInt').returns(42);
  //
  //       assert.equal(new MyClass().getInt(), 42);
  //     });
  //
  //     it('prevent class constructor from running when used as dependency of a module under test', () => {
  //       const complexClassStub = sinon.createStubInstance(ComplexClassWithBadConstructor);
  //       const moduleUnderTest = proxyquire('../src/stubExamples/moduleUnderTest', {
  //         './ComplexClassWithBadConstructor': function(){
  //           return complexClassStub;
  //         }
  //       });
  //
  //       complexClassStub.getInt.returns(42);
  //
  //       assert.equal(moduleUnderTest.createComplexClassAndUseItToReturnAValue(), 42);
  //     });
  //
  //     it('assert that a class dependency is created with the proper configuration', () => {
  //       // Sometimes you have to confirm that a dependency is created with the proper configuration (such as the correct
  //       // base URL).
  //
  //       const complexClassStub = sinon.createStubInstance(ComplexClassWithBadConstructor);
  //       // Injected ComplexClass constructor that will be spyable.
  //       const ComplexClassWithBadConstructorSpy = sinon.spy(function () {
  //         return complexClassStub;
  //       });
  //       const moduleUnderTest = proxyquire('../src/stubExamples/moduleUnderTest', {
  //         './ComplexClassWithBadConstructor': ComplexClassWithBadConstructorSpy
  //       });
  //
  //       moduleUnderTest.createComplexClassAndUseItToReturnAValue('test');
  //
  //       // assert how you expect the constructor should be used
  //       assert.isTrue(ComplexClassWithBadConstructorSpy.calledWithNew());
  //       assert.equal(ComplexClassWithBadConstructorSpy.callCount, 1);
  //       assert.isTrue(ComplexClassWithBadConstructorSpy.calledWithExactly('test'));
  //     });
  //   });
  //
  // });

});