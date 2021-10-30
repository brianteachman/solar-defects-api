const express = require('express');
const router = express.Router();

const DataManager = require('../../datamanger');
const csvdm = new DataManager();
// csvdm.insert(csvdm.test_defects);

/* GET defect listing. */
router.get('/', function (req, res, next) {

    // Return JSON to the client
    res.json(csvdm.data);
});

/* GET defect listing. */
router.get('/id/:panel_id', function (req, res, next) {
    let data = [];

    // csvdm.loadEntries mutates data by adding any entries found and returning whether any found.
    if (csvdm.loadEntries(req.params.panel_id, data)) {
        console.log("Yep, " + req.params.panel_id + " exist in data set.");
    } else {
        console.log("Nope, " + req.params.panel_id + " not found in data set.");
        data.push({status_code: "404", error_message: "No entries found."});
    }

    // Return JSON to the client
    res.json(data);
});


module.exports = router;
