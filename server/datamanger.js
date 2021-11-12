const fs = require("fs");
const csvParser = require('csv-parser');
const csvWriter = require("csv-writer").createObjectCsvWriter({
    path: 'data/defect_data.csv',
    append: true,
    header: [ // Panel ID,Date,Time,Location,From,Defect Type,Cause,Found At,UID
        {id: 'panel_id', title: 'Panel ID'},
        {id: 'date', title: 'Date'},
        {id: 'time', title: 'Time'},
        {id: 'location', title: 'Location'},
        {id: 'from', title: 'From'},
        {id: 'defect_type', title: 'Defect Type'},
        {id: 'cause', title: 'Cause'},
        {id: 'found', title: 'Found At'},
        {id: 'uid', title: 'UID'}
    ]
});

function DataManager() {
    this.data = [];

    // TODO: Make this asynchronous (using async/await).
    fs.createReadStream('data/defect_data.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            this.data.push(row);
            // console.log(row);
        })
        .on('end', () => {
            console.log('Data loaded: CSV file successfully processed.');
        });
}

DataManager.prototype.insert = function (defects) {
    // TODO: also add to in-memory dataset
    csvWriter.writeRecords(defects).then(() => {
        console.log('...Done');
    });
}

/**
 * Adds any entries having Panel_ID equal to panelId to the list named data and returns true if any found.
 *
 * WARNING: This method is mutable
 *
 * @param panelId
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

/**
 * Return list of entries having Panel_ID equal to panelId if any found.
 *
 * Note: this method is immutable
 *
 * @param panelId
 * @returns {*[]}
 */
DataManager.prototype.getDefects = function (panelId) {
    let data = [];
    this.loadEntries(panelId, data);
    return data;
}

/**
 * Just some test data
 *
 * @type {[{panel_id: string, date: string, uid: string, found: string, cause: string, location: string, from: string, time: string, defect_type: string}]}
 */
DataManager.prototype.test_defects = [
    {
        panel_id: '46832446881',
        date: '10/29/2021',
        time: '2:40 AM',
        location: 'B09',
        from: 'Stringer 2',
        defect_type: 'TD',
        cause: 'Machine',
        found: 'EL PreLam (QC3)',
        uid: '0026'
    },
    {
        panel_id: '46832446881',
        date: '10/29/2021',
        time: '2:40 AM',
        location: 'B09',
        from: 'Stringer 2',
        defect_type: 'CC',
        cause: 'Machine',
        found: 'EL PreLam (QC3)',
        uid: '0027'
    },
    {
        panel_id: '46832446881',
        date: '10/29/2021',
        time: '2:40 AM',
        location: 'B09',
        from: 'Stringer 2',
        defect_type: 'MS',
        cause: 'Machine',
        found: 'EL PreLam (QC3)',
        uid: '0028'
    }
];

module.exports = new DataManager();
// module.exports = DataManager;
