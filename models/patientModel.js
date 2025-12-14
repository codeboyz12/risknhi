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

// [เพิ่มในไฟล์ models/patientModel.js]

exports.autoHealOldPatients = () => {
    return new Promise((resolve, reject) => {
        // SQL: อัปเดตให้ stillsick = 0 (False) 
        // เงื่อนไข: stillsick เป็น 1 (True) และเวลา (time) น้อยกว่า "เวลาปัจจุบันลบ 24 ชม."
        const sql = `
            UPDATE patient 
            SET stillsick = 0 
            WHERE stillsick = 1 
            AND time <= DATETIME('now', '-24 hours')
        `;

        db.run(sql, [], function (err) {
            if (err) {
                console.log(`[patientModel] Auto-heal error: ${err}`);
                reject(err);
            } else {
                if (this.changes > 0) {
                    console.log(`[patientModel] Auto-healed ${this.changes} patients (older than 24h).`);
                }
                resolve(this.changes);
            }
        });
    });
}
