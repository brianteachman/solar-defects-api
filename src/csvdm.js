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

let dataManager = {
    data: []
};

// TODO: Make this asynchronous (using async/await).
fs.createReadStream('data/defect_data.csv')
    .pipe(csvParser())
    .on('data', (row) => {
        dataManager.data.push(row);
        // console.log(row);
    })
    .on('end', () => {
        console.log('Data loaded: CSV file successfully processed.');
    });

module.exports.data = dataManager.data;

module.exports.insert = function (defects) {
    csvWriter.writeRecords(defects).then( () => {
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
module.exports.loadEntries = function (panelId, data) {
    let isMatch = false;
    dataManager.data.forEach((defect) => {
        if (defect.Panel_ID === panelId) {
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
module.exports.getDefects = function (panelId) {
    let data = [];
    dataManager.loadEntries(panelId, data);
    return data;
}

module.exports.test_defects = [
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