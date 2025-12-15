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
        FOREIGN KEY (userID) REFERENCES USERS(userID),
        FOREIGN KEY (buildingID) REFERENCES BUILDING(buildingID)
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