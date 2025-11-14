const db = require('../config/db');

exports.insert = (userID, firstname, lastname) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (userID, firstname, lastname) VALUES (?, ?, ?)',
            [userID, firstname, lastname],
            function (err) {
                if (err) {
                    console.log(`[userModel] ${err}`);
                    reject(err);
                } else {
                    console.log('[userModel] Created new users.');
                    resolve(this.lastID);
                }
            }
        );
    });
}

exports.selectAll = () => {
    return new Promise((resolve, reject) => {
        db.run('SELECT * FROM users', [],
            function (err, row) {
                if (err) {
                    console.log(`[userModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[userModel] Return all rows`);
                    resolve(row);
                }
            }
        );
    });
}