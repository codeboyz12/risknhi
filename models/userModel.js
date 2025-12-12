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

exports.checkRecentSick = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT buildingID AS at, stillsick AS isSick
            FROM patient
            WHERE userID = ?
              AND stillsick = TRUE
              AND time >= DATETIME('now', '-24 hours')
            ORDER BY time DESC
            LIMIT 1
        `;

        db.get(sql, [userID], (err, row) => {
            if (err) {
                console.log(`[patientModel] ${err}`);
                reject(err);
            } else {
                resolve(row); // รีเทิร์นเป็น boolean
            }
        });
    });
};
