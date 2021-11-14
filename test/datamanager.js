let DataManager = require("../src/datamanger");

let chai = require("chai");
let expect = chai.expect;

describe("CRUD Testing: Data Access", function () {

    let dm = new DataManager("data/defect_data.csv");

    beforeEach(function () {
        // dm = new DataManager("data/defect_data.csv");
    })

    it('should prepend x-number of zeros', function () {
        expect(dm.padZeros('35', 5)).to.equal('00035');
        expect(dm.padZeros('35', 9)).to.equal('000000035');
        expect(dm.padZeros('35', 0)).to.equal('35');
        expect(dm.padZeros('0', 0)).to.equal('0');
        expect(dm.padZeros('0', 1)).to.equal('0');
        expect(dm.padZeros('0', 2)).to.equal('00');
    });

    it('should return filtered data', function () {
        let defects = dm.filter({Panel_ID: "46832446881", Defect_Type: "CC"});
        expect(defects.length).to.equal(3);
        expect(defects[3]).to.not.exist;
        // Check that filtered defects have correct details
        expect(defects[0].Panel_ID === "46832446881").to.be.true;
        expect(defects[1].Panel_ID === "46832446881").to.be.true;
        expect(defects[2].Panel_ID === "46832446881").to.be.true;
        expect(defects[0].Defect_Type).to.equal("CC");
        expect(defects[1].Defect_Type).to.equal("CC");
        expect(defects[2].Defect_Type).to.equal("CC");
    });

    it('should write new entry to CSV file', function () {
        let testData = [
            {
                Panel_ID: "46832447010",
                Date: "11/13/2021",
                Time: "10:40 PM",
                Location: "D07",
                From: "Stringer 1",
                Defect_Type: "CC",
                Cause: "Machine",
                Found: "EL PreLam (QC3)",
            }
        ];
        let result = [];
        let uid = dm.nextUID().toString();
        //---------------------------------
        dm.insert(testData);
        //---------------------------------
        dm.loadData("UID", uid, result);
        expect(result.length).to.equal(1);
        expect(result[0].UID).to.equal(uid);
    });
})