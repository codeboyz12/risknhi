const { json } = require('express');
const patientModel = require('../models/patientModel');
const sessions = require('../variable/variable');

exports.addPatient = async (req, res) => {
    try {
        // const {session, buildingID, floor_number} = req.body;
        const {userID, buildingID, floor_number} = req.body;
        // const userID = sessions[session].userId;
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

exports.userGetWell = async (req, res) => {
    const {session} = req.body;
    console.log(session)
    console.log(sessions[session])
    const userID = sessions[session].userId;
    const response = await patientModel.updateStillSickFalseByUser(userID);

    if(response.success){
        res.json({
            success: true
        })
    }
}

// [เพิ่มต่อท้ายไฟล์ controllers/patientController.js]

exports.updatePatientLocation = async (req, res) => {
    try {
        const { session, buildingID, floor_number } = req.body;

        // ตรวจสอบว่ามี session หรือไม่
        if (!session || !sessions[session]) {
            return res.json({
                success: false,
                message: "Invalid session"
            });
        }

        const userID = sessions[session].userId;

        // ตรวจสอบว่าส่งข้อมูลครบไหม
        if (!buildingID || !floor_number) {
            return res.json({
                success: false,
                message: "Building ID and Floor Number are required"
            });
        }

        const result = await patientModel.updateLocationByUser(userID, buildingID, floor_number);

        if (result.success && result.affectedRows > 0) {
            res.json({
                success: true,
                message: "Location updated successfully"
            });
        } else {
            // กรณีหา record ที่ป่วยไม่เจอ หรือ update ไม่สำเร็จ
            res.json({
                success: false,
                message: "User is not currently sick or update failed"
            });
        }

    } catch (err) {
        console.log(`[patientController] ${err}`);
        res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
}