const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/risknhiDB.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('[CONFIG/DB] Cannot connect to database.');
    } else {
        console.log('[CONFIG/DB] Database connected.');
    }
})

const buildingsData = [
    { "buildingID": 1,  "building_name": "S1 อาคารวิศวกรรมเครื่องกล 4", "total_floor": 12 },
    { "buildingID": 2,  "building_name": "S2 อาคารจอดรถ", "total_floor": 9 },
    { "buildingID": 3,  "building_name": "S3 อาคารสถาบันนวัตกรรมการเรียนรู้", "total_floor": 15 },
    { "buildingID": 4,  "building_name": "S4 อาคารวิศววัฒนะ", "total_floor": 18 },
    { "buildingID": 5,  "building_name": "S5 บ้านธรรมรักษา", "total_floor": 10 },
    { "buildingID": 6,  "building_name": "S6 บ้านธรรมรักษา", "total_floor": 11 },
    { "buildingID": 7,  "building_name": "S7 Classroom Building 5", "total_floor": 14 },
    { "buildingID": 8,  "building_name": "S8 Classroom Building 4", "total_floor": 13 },
    { "buildingID": 9,  "building_name": "S9 Classroom Building 3", "total_floor": 16 },
    { "buildingID": 10, "building_name": "N1 อาคารศูนย์ต้อนรับ", "total_floor": 8 },
    { "buildingID": 11, "building_name": "N2 อาคารสำนักงานอธิการบดี", "total_floor": 12 },
    { "buildingID": 12, "building_name": "N3 ภาควิชาเคมี", "total_floor": 9 },
    { "buildingID": 13, "building_name": "N4 ภาควิชาฟิสิกส์-คณิตศาสตร์", "total_floor": 10 },
    { "buildingID": 14, "building_name": "N5 Scientific Instrument Center", "total_floor": 7 },
    { "buildingID": 15, "building_name": "N6 ภาควิชาจุลชีววิทยา", "total_floor": 8 },
    { "buildingID": 16, "building_name": "N7 Fundamental Science Laboratory", "total_floor": 11 },
    { "buildingID": 17, "building_name": "N10 KMUTT Library", "total_floor": 20 },
    { "buildingID": 18, "building_name": "N12 School of Information Technology", "total_floor": 15 },
    { "buildingID": 19, "building_name": "N13 Learning Exchange", "total_floor": 14 },
    { "buildingID": 20, "building_name": "N15 Classroom Building 2", "total_floor": 17 },
    { "buildingID": 21, "building_name": "N18 Classroom Building 1", "total_floor": 16 }
];

const usersTable = `
    CREATE TABLE IF NOT EXISTS users(
        userID INTEGER PRIMARY KEY NOT NULL,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        FOREIGN KEY (userID) REFERENCES auth(userID) ON DELETE CASCADE
    )
`;

const authTable = `
    CREATE TABLE IF NOT EXISTS auth (
      userID INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
`;

const buildingTable = `
    CREATE TABLE IF NOT EXISTS building (
        buildingID INTEGER PRIMARY KEY AUTOINCREMENT,
        building_name VARCHAR(255) NOT NULL,
        total_floor INTEGER(2) NOT NULL
    )
`;

const patientTable = `
    CREATE TABLE IF NOT EXISTS patient (
        patientID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER NOT NULL,
        buildingID INTEGER NOT NULL,
        floor_number INTEGER NOT NULL CHECK (floor_number BETWEEN 1 AND 99),
        stillsick BOOLEAN NOT NULL DEFAULT true,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userID) REFERENCES users(userID),
        FOREIGN KEY (buildingID) REFERENCES building(buildingID)
    )
`;


db.run(usersTable, (err) => {
    if (err) {
        console.log('[CONFIG/DB] Error connect to users table.');
        return console.log(err);
    } else {
        return console.log('[CONFIG/DB] Users table connected.');
    }
})

db.run(authTable, (err) => {
    if (err) {
        console.log('[CONFIG/DB] Error connect to auth table.');
        return console.log(err);
    } else {
        return console.log('[CONFIG/DB] Auth table connected.');
    }
})

db.run(buildingTable, (err) => {
    if (err) {
        console.log('[CONFIG/DB] Error connect to building table.');
        return console.log(err);
    } else {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO building (buildingID, building_name, total_floor) 
            VALUES (?, ?, ?)
        `);

        buildingsData.forEach(b => {
            stmt.run(b.buildingID, b.building_name, b.total_floor);
        });

        stmt.finalize(() => {
            console.log("[CONFIG/DB] Buildings data initialized.");
        });

        return console.log('[CONFIG/DB] Building table connected.');
    }
})

db.run(patientTable, (err) => {
    if (err) {
        console.log('[CONFIG/DB] Error connect to patient table.');
        return console.log(err);
    } else {
        return console.log('[CONFIG/DB] Patient table connected.');
    }
})

db.run("PRAGMA foreign_keys = ON;");

module.exports = db;