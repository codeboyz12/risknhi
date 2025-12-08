const db = require('../config/db');

exports.insert = (userID, buildingID, floor_number) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO patient (userID, buildingID, floor_number) VALUES (?, ?, ?)',
            [userID, buildingID, floor_number],
            function (err) {
                if (err) {
                    console.log(`[patientModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[patientModel] Created new patient`);
                    resolve(this.lastID);
                }
            }
        )
    });
}

exports.selectAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM patient', [],
            function (err, row) {
                if (err) {
                    console.log(`[patientModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[patientModel] Return all rows`);
                    resolve(row);
                }
            }
        );
    });
}