'use strict';
const ClassA = require('./ClassA');
const ComplexClassWithBadConstructor = require('./ComplexClassWithBadConstructor');

function _useClassInstanceToReturnAValue() {
  const classA = new ClassA();
  let value = classA.getNumber();
  return value === 42 ? 'The answer to life' : value;
}

function _createComplexClassAndUseItToReturnAValue(arg1) {
  return new ComplexClassWithBadConstructor(arg1).getInt();
}

module.exports = {
  useClassInstanceToReturnAValue: _useClassInstanceToReturnAValue,
  createComplexClassAndUseItToReturnAValue: _createComplexClassAndUseItToReturnAValue
};