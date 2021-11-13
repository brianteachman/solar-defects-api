const fs = require("fs");
const csvParser = require('csv-parser');
const csvWriter = require("csv-writer").createObjectCsvWriter({
    path: 'data/defect_data.csv',
    append: true,
    header: [ // Panel ID,Date,Time,Location,From,Defect Type,Cause,Found At,UID
        {id: 'panel_id', title: 'Panel_ID'},
        {id: 'date', title: 'Date'},
        {id: 'time', title: 'Time'},
        {id: 'location', title: 'Location'},
        {id: 'from', title: 'From'},
        {id: 'defect_type', title: 'Defect_Type'},
        {id: 'cause', title: 'Cause'},
        {id: 'found', title: 'Found'},
        {id: 'uid', title: 'UID'}
    ]
});

//
function DataManager(file) {
    this.data = [];

    // TODO: Make this asynchronous (using async/await).
    fs.createReadStream(file)
        .pipe(csvParser())
        .on('data', (row) => {
            this.data.push(row);
        })
        .on('end', () => {
            console.log(this.data.length + ' entries loaded: CSV file successfully processed.');
        });
}

function padString(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getLastUID() {
    return parseInt(this.data[this.data.length - 1].UID);
}

/**
 * Insert defect data into memory and the CSV file.
 *
 * @param defects
 */
DataManager.prototype.insert = function (defects) {
    let size = getLastUID.call(this);
    defects.forEach( (defect) => {
        // defect.uid = padString(++size, 12);  //TODO: this should be done in the view to keep the file size down
        defect.uid = (++size).toString();
        this.data.push(defect);  // Add new entry to in-memory dataset
    })
    csvWriter.writeRecords(defects).then(() => {
        console.log('...Done');
    });
}

/**
 * Adds any entries having a key equal to the given value to the array data and returns true if any found.
 *
 * WARNING: This method mutates the data array.
 *
 * @param key
 * @param value
 * @param data
 * @returns {boolean}
 */
DataManager.prototype.loadEntries = function (key, value, data) {
    let isMatch = false;
    this.data.forEach((defect) => {
        if (defect[key] === value) {
            data.push(defect);
            isMatch = true;
        }
    });
    return isMatch;
}

// ----------------------------------------------------------------------------

const DATA_FILE = 'data/defect_data.csv';
module.exports = new DataManager(DATA_FILE);  //TODO: for now this is convenient

// module.exports = DataManager;
