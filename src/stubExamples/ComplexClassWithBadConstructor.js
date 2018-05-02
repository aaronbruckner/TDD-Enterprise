'use strict';

class ComplexClassWithBadConstructor {
  constructor(arg1) {
    throw new Error('This is a really complex class. When used as a dependency, you want to fully mock this resource out.');
  }

  getInt() {
    return 1;
  }
}

module.exports = ComplexClassWithBadConstructor;