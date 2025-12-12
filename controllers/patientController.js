const { json } = require('express');
const patientModel = require('../models/patientModel');
const sessions = require('../variable/variable');

exports.addPatient = async (req, res) => {
    try {
        const {session, buildingID, floor_number} = req.body;
        const userID = sessions[session].userId;
        const patientId = await patientModel.insert(userID, buildingID, floor_number);

        res.json({
            success: true,
            buildId: patientId
        });
    } catch(err){
        console.log(`[patientController] ${err}`);
        res.json({
            success: false,
        })
    }
}


exports.getAllPatient = async (req, res) => {
    const row = await patientModel.selectAll();
    res.json(row);
}

exports.dashboard = async (req, res) => {
    const row = await patientModel.dashboard();

    res.json({
        success: true,
        data: row
    });
}