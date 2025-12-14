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
        // แก้ไข SQL: JOIN ตาราง patient กับ building เพื่อเอาชื่อตึก
        const sql = `
            SELECT 
                b.building_name AS at, 
                p.stillsick AS isSick
            FROM patient p
            JOIN building b ON p.buildingID = b.buildingID
            WHERE p.userID = ?
              AND p.stillsick = 1
              AND p.time >= DATETIME('now', '-24 hours')
            ORDER BY p.time DESC
            LIMIT 1
        `;

        db.get(sql, [userID], (err, row) => {
            if (err) {
                console.log(`[userModel] ${err}`); // แก้ log ให้ตรงกับไฟล์
                reject(err);
            } else {
                resolve(row); 
            }
        });
    });
};
