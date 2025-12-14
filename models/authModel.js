const db = require('../config/db');

exports.insert = (username, password) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO auth (username, password) VALUES (?, ?)',
            [username, password],
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
        db.all('SELECT * FROM auth', [],
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

exports.selectByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM auth WHERE username = ?',
            [username],
            function (err, row) {
                if (err) {
                    console.log(`[authModel] ${err}`);
                    reject(err);
                } else if (!row) {
                    console.log(`[authModel] Row not found`);
                    resolve(null);
                } else {
                    console.log(`[authModel] Return rows`);
                    resolve(row);
                }
            }
        )
    })
}