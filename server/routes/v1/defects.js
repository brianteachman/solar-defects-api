const express = require('express');
const router = express.Router();

const csvdm = require('../../datamanger');

function selectAll(key, value) {
    let data = [];
    if (csvdm.loadEntries(key, value, data)) {
        console.log("Yep, there are entries from. " + key + ": " + value + ".");
    } else {
        console.log("Nope, " + key + ": " + value + " not found in data set.");
        data.push({status_code: "404", error_message: "No entries found."});
    }
    return data;
}

/* GET defect listing. */
router.get('/', function (req, res, next) {
    let filter = req.query; //TODO: implement filtering

    res.json(csvdm.data); // Return JSON to the client
});

/* GET defect listing for specific panel. */
router.get('/id/:panel_id', function (req, res, next) {
    let data = selectAll("Panel_ID", req.params.panel_id);

    res.json(data); // Return JSON to the client
});

/* GET defect listing from a specific station. */
router.get('/station/:from', function (req, res, next) {
    let station = req.params.from;
    let data = selectAll("From", station);

    res.json(data); // Return JSON to the client
});

router.post('/add', function (req, res) {
    let panel = req.query;
    csvdm.insert([panel]);

    res.json([{
        title: "So, you'd like to insert?",
        panel: [panel]
    }]);
});

module.exports = router;
