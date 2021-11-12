const express = require('express');
const router = express.Router();

const csvdm = require('../../datamanger');
// csvdm.insert(csvdm.test_defects);

/* GET defect listing. */
router.get('/', function (req, res, next) {

    res.json(csvdm.data); // Return JSON to the client
});

/* GET defect listing for specific panel. */
router.get('/id/:panel_id', function (req, res, next) {
    let data = [];
    let panelId = req.params.panel_id;

    // csvdm.loadEntries mutates data by adding any entries found and returning whether any found.
    if (csvdm.loadEntries("Panel_ID", panelId, data)) {
        console.log("Yep, " + panelId + " exist in data set.");
    } else {
        console.log("Nope, " + panelId + " not found in data set.");
        data.push({status_code: "404", error_message: "No entries found."});
    }

    res.json(data); // Return JSON to the client
});

/* GET defect listing from a specific station. */
router.get('/station/:from', function (req, res, next) {
    let data = [];
    let station = req.params.from;

    // csvdm.loadEntries mutates data by adding any entries found and returning whether any found.
    if (csvdm.loadEntries("From", station, data)) {
        console.log("Yep, " + station + " exist in data set.");
    } else {
        console.log("Nope, " + station + " not found in data set.");
        data.push({status_code: "404", error_message: "No entries found."});
    }

    res.json(data); // Return JSON to the client
});


module.exports = router;
