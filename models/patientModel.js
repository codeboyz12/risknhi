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

exports.dashboard = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                b.buildingID,
                b.building_name,
                COUNT(p.patientID) AS total
            FROM building b
            LEFT JOIN patient p 
                ON b.buildingID = p.buildingID 
                AND p.stillsick = TRUE
            GROUP BY b.buildingID, b.building_name
            ORDER BY total DESC;
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(`[patientModel] ${err}`);
                reject(err);
            } else {
                console.log(`[patientModel] Dashboard grouped by building name`);
                resolve(rows);
            }
        });
    });
}

exports.updateStillSickFalseByUser = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE patient
            SET stillsick = FALSE
            WHERE userID = ?
              AND stillsick = TRUE
        `;

        db.run(sql, [userID], function (err) {
            if (err) {
                console.log(`[patientModel] ${err}`);
                reject(err);
            } else {
                console.log(`[patientModel] Updated stillsick=false for userID=${userID}`);
                resolve({
                    success: true,
                    affectedRows: this.changes
                });
            }
        });
    });
};

exports.updateLocationByUser = (userID, buildingID, floor_number) => {
    return new Promise((resolve, reject) => {
        // อัปเดตตึกและชั้น สำหรับ record ล่าสุดที่ยังป่วยอยู่
        const sql = `
            UPDATE patient
            SET buildingID = ?, 
                floor_number = ?,
                time = CURRENT_TIMESTAMP
            WHERE userID = ? 
              AND stillsick = TRUE
        `;

        db.run(sql, [buildingID, floor_number, userID], function (err) {
            if (err) {
                console.log(`[patientModel] Update location error: ${err}`);
                reject(err);
            } else {
                console.log(`[patientModel] Updated location for userID=${userID}`);
                resolve({
                    success: true,
                    affectedRows: this.changes
                });
            }
        });
    });
};

exports.deleteByUserID = (userID) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM patient WHERE userID = ?', 
            [userID],
            function (err) {
                if (err) {
                    console.log(`[patientModel] ${err}`);
                    reject(err);
                } else {
                    console.log(`[patientModel] Deleted patient records for userID: ${userID}`);
                    resolve(this.changes);
                }
            }
        );
    });
}