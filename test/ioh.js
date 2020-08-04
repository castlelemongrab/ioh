
'use strict';

const path = require('path');
const chai = require('chai');
const IO = require('../src/ioh');
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
    let i1 = new IO.Plug();
    let i2 = new IO.NodePlug();
    i1.stdout(s).toString().should.equal(s);
    i2.stdout(s).toString().should.equal(s);
  });

  it('can read files', () => {
    let i = new IO.Node();
    i.read_file(path.join(__dirname, 'fixtures', 'text', 'hello.txt'))
      .should.eventually.equal('world\n');
  });
});

