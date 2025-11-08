const db = require('../config/db');

exports.insert = (userID, username, password) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INO auth (userID, username, password) VALUES (?, ?, ?)',
            [userID, username, password],
            function (err) {
                if (err) {
                    console.log(`[authModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[authModel] Created new auth`);
                    resolve(this.lastID);
                }
            }
        );
    });
}

exports.selectAll = () => {
    return new Promise((resolve, reject) => {
        db.run('SELECT * FROM auth', [],
            function (err, row) {
                if (err) {
                    console.log(`[authModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[authModel] Return all rows`);
                    resolve(row);
                }
            }
        );
    });
}