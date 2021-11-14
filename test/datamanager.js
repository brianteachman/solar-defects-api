let csvdm = require("../src/datamanger");

let chai = require("chai");
let expect = chai.expect;

describe("CRUD Testing: Data Access", function () {

    it('should prepend x-number of zeros', function () {
        expect(csvdm.padZeros('35', 5)).to.equal('00035');
        expect(csvdm.padZeros('35', 9)).to.equal('000000035');
    });
})