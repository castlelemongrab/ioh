
'use strict';

const path = require('path');
const chai = require('chai');
const IO = require('../../src/ioh');
const promises = require('chai-as-promised');

/**
 * @name ioh:
 *   Unit tests for the I/OH utilities library.
 */
describe('ioh', () => {

  let expect = chai.expect;
  let should = chai.should();
  chai.use(promises);

  it('can plug output', () => {

    let s = 'Hello, world!\n';
    let i1 = new IO.Plug();
    let i2 = new IO.NodePlug();

    i1.stdout(s).toString().should.equal(s);
    i2.stdout(s).toString().should.equal(s);

    i2.write_file('test.txt', 'plug\n').should.be.fulfilled;

    i2.files['test.txt'].should.equal('plug\n');
    i2.get_file('test.txt').should.equal('plug\n');

    i1.reset(); i2.reset();

    i1.files.should.deep.equal({});
    i2.files.should.deep.equal({});
    expect(i1.toString()).to.be.null;
    expect(i2.toString()).to.be.null;
    expect(i1.get_file('text.txt')).to.be.undefined;
    expect(i2.get_file('text.txt')).to.be.undefined;
  });

  it('can read files', () => {
    let i = new IO.Node();
    i.read_file(path.join(__dirname, '..', 'fixtures', 'text', 'hello.txt'))
      .should.eventually.equal('world\n');
  });
});

