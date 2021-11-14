const fs = require("fs");
const csvParser = require('csv-parser');
const createCsvWriter = require("csv-writer");

let csvWriter;
let csvHeaders = [ // Panel ID,Date,Time,Location,From,Defect Type,Cause,Found At,UID
    {id: 'Panel_ID', title: 'Panel_ID'},
    {id: 'Date', title: 'Date'},
    {id: 'Time', title: 'Time'},
    {id: 'Location', title: 'Location'},
    {id: 'From', title: 'From'},
    {id: 'Defect_Type', title: 'Defect_Type'},
    {id: 'Cause', title: 'Cause'},
    {id: 'Found', title: 'Found'},
    {id: 'UID', title: 'UID'}
];

//
function DataManager(file) {
    this.data = [];

    csvWriter = createCsvWriter.createObjectCsvWriter({
        path: file,
        append: true,
        header: csvHeaders
    });

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

function _getLastUID() {
    if (this.data.length === 0) return 0;
    return parseInt(this.data[this.data.length - 1].UID);
    // TODO: Fix this calls dependence on the domain dataset
}

function _union(arrayA, arrayB) {
    let setA = new Set(arrayA);
    let setB = new Set(arrayB);
    let union = new Set(setA);
    for (let elem of setB) {
        union.add(elem);
    }
    return [...union];
}

function _intersection(arrayA, arrayB) {
    let setA = new Set(arrayA);
    let setB = new Set(arrayB);
    let intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }
    // NOTE: the use of the spread operator (...) to convert Set to Array
    return [...intersection];
}


DataManager.prototype.nextUID = function () {
    return _getLastUID.call(this) + 1;
}

/**
 * Insert defect data into memory and the CSV file.
 *
 * @param defects
 */
DataManager.prototype.insert = function (defects) {
    let uid = this.nextUID();
    defects.forEach( (defect) => {
        defect.UID = uid.toString();
        this.data.push(defect);  // Add new entry to in-memory dataset
    })
    csvWriter.writeRecords(defects).then(() => {
        console.log(defects.length + ' defect(s) have been added.');
    });
}

/**
 * Adds any entries having a key equal to the given value to the array data and returns true if any found.
 *
 * NOTE: This method mutates the given data array, but does not mutate the in-memory or CSV dataset.
 *
 * @param key
 * @param value
 * @param data
 * @returns {boolean}
 */
DataManager.prototype.loadData = function (key, value, data) {
    let isMatch = false;
    this.data.forEach((defect) => {
        if (defect[key] === value) {
            data.push(defect);
            isMatch = true;
        }
    });
    return isMatch;
}

/**
 * Intersects a result set array from filtered arrays using HTTP query arguments.
 *
 * Uses Javascript Set
 *
 * @param urlQueryObject
 * @returns {*}
 */
DataManager.prototype.filter = function (urlQueryObject) {
    let filterParamsArray = Object.entries(urlQueryObject);
    let filtered = [];

    // If there are Query parameters in the URL, then try to filter with them:
    if (filterParamsArray.length > 0) {
        filterParamsArray.forEach(([k, v]) => {
            filtered.push(this.data.filter(defect => defect[k] === v));
        });
        if (filtered.length === 1) {
            filtered = filtered[0];
        } else {
            let lastSet;
            for (let i = 0; i < filtered.length; i++) {
                if (i === 0) {
                    lastSet = filtered[i];
                    continue;
                }
                lastSet = _intersection(lastSet, filtered[i]);
            }
            filtered = lastSet;
        }
    } else {
        filtered = this.data;
    }
    return filtered;
}

DataManager.prototype.padZeros = function (num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

// ----------------------------------------------------------------------------

// const DATA_FILE = 'data/defect_data.csv';
// module.exports = new DataManager(DATA_FILE);  //TODO: for now this is convenient

module.exports = DataManager;
