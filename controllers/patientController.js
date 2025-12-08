const { json } = require('express');
const patientModel = require('../models/patientModel');

exports.addPatient = async (req, res) => {
    try {
        const {userID, buildingID, floor_number} = req.body;
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