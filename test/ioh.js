
'use strict';

const chai = require('chai');
const IOH = require('../src/ioh');
const promises = require('chai-as-promised');

/**
 * @name ioh:
 *   Unit tests for the I/OH utilities library.
 */
describe('ioh', () => {

  let should = chai.should();
  chai.use(promises);

  it('can plug output', () => {
    let s = 'Hello, world!\n';
    let i1 = new IOH.Plug();
    let i2 = new IOH.NodePlug();
    i1.stdout(s).toString().should.equal(s);
    i2.stdout(s).toString().should.equal(s);
  });
});

