const db = require('../config/db');

exports.insert = (building_name, total_floor) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO building (building_name, total_floor) VALUES (?, ? )',
            [building_name, total_floor],
            function (err) {
                if (err) {
                    console.log(`[buildingModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[buildingModel] Created new buiding`);
                    resolve(this.lastID);
                }
            }
        )
    });
}

exports.selectAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM building', [],
            function (err, row) {
                if (err) {
                    console.log(`[buildingModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[buildingModel] Return all rows`);
                    resolve(row);
                }
            }
        );
    });
}