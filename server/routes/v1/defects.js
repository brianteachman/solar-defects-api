const express = require('express');
const router = express.Router();

const csvdm = require('../../datamanger');

// selectAll does not mutate the in-memory or CSV dataset
function selectAll(key, value) {
    let data = [];
    if (csvdm.select(key, value, data)) {
        console.log("Yep, there are entries from. " + key + ": " + value + ".");
    } else {
        console.log("Nope, " + key + ": " + value + " not found in data set.");
        data.push({error: true, error_message: "No entries found."});  // if data[0].error is true, then 404
    }
    return data;
}

/* GET defect listing. */
router.get('/', function (req, res, next) {
    let filter = req.query; //TODO: implement filtering
    console.log(filter);
    let data = csvdm.data;
    if (Object.entries(filter).length > 0) {
        // data = csvdm.data.filter();
        data = filter;
    }
    res.json(data); // Return JSON to the client
});

/* GET defect listing for specific panel. */
router.get('/id/:panel_id', function (req, res, next) {
    let data = selectAll("Panel_ID", req.params.panel_id);
    if (data[0].error) res.status(404);
    res.json(data);
});

/* GET defect listing from a specific station. */
router.get('/station/:from', function (req, res, next) {
    let station = req.params.from;
    let data = selectAll("From", station);
    if (data[0].error) res.status(404);
    res.json(data);
});

router.post('/add', function (req, res) {
    let panel = req.query;  //TODO: validate this input!!
    csvdm.insert([panel]);
    res.json([{
        title: "So, you wanted to insert?",
        panel: [panel]
    }]);
});

module.exports = router;
