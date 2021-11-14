const express = require('express');
const router = express.Router();

const DataManager = require('../../datamanger');
const dm = new DataManager("data/defect_data.csv");

// selectAll does not mutate the in-memory or CSV dataset
function selectAll(key, value) {
    let data = [];
    if (dm.loadData(key, value, data)) {
        console.log("Yep, there are entries from. " + key + ": " + value + ".");
    } else {
        console.log("Nope, " + key + ": " + value + " not found in data set.");
        data.push({error: true, error_message: "No entries found."});  // if data[0].error is true, then 404
    }
    return data;
}

function isValidPanelID(panelID) {
    return (new RegExp(/\d{11}/)).test(panelID);
}

// GET defect listing.
router.get('/', function (req, res, next) {
    let urlQueryObject = req.query;
    let data = dm.filter(urlQueryObject);
    res.status(200).json(data); // Return JSON to the client
});

// GET defect listing for specific panel.
router.get('/:panel_id', function (req, res, next) {
    if (!isValidPanelID(req.params.panel_id)) {
        console.log(req.params.panel_id + " not valid format.");
        res.sendStatus(404);
        return;
    }
    let data = selectAll("Panel_ID", req.params.panel_id);
    if (data[0].error) {
        console.log("Panel_ID " + req.params.panel_id + " not found.");
        res.sendStatus(404);
        return;
    };
    res.json(data);
});

// GET defect listing from a specific station.
router.get('/station/:from', function (req, res, next) {
    let station = req.params.from;
    let data = selectAll("From", station);
    if (data[0].error) res.sendStatus(404);
    res.json(data);
});

router.post('/:panel_id', function (req, res) {
    if (!isValidPanelID(req.params.panel_id)) {
        console.log(req.params.panel_id + " not valid format.");
        res.sendStatus(404);
        return;
    }

    let panel_data = {Panel_ID: req.params.panel_id};
    Object.entries(req.query).forEach( ([k,v]) => {
        //TODO: validate this input!!
        panel_data[k] = v;
    })

    // console.log([panel_data]);
    dm.insert([panel_data]);
    res.json([{
        title: "So, you wanted to insert?",
        panel: [panel_data]
    }]);
});

module.exports = router;
