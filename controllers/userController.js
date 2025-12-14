const { json } = require('express');
const userModel = require('../models/userModel');

exports.isUserSick = async (req, res) => {
    try{
        const {userID} = req.body;
        const data = await userModel.checkRecentSick(userID);
        if( data == null ){
            res.json({
                "success": true,
                "stillsick": false,
            })
        } else {
            res.json({
                "success": true,
                "stillsick": true,
                "data": data
            })
        }

    } catch (err) {
        console.log(`[userController] ${err}`)
        res.json({
            "success": false
        });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        if (!sessionId || !sessions[sessionId]) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const userID = sessions[sessionId].userId;
        const userData = await userModel.selectById(userID);

        if (userData) {
            res.json({
                success: true,
                data: userData
            });
        } else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.log(`[userController] getProfile error: ${err}`);
        res.json({ success: false, message: "Server error" });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        if (!sessionId || !sessions[sessionId]) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const userID = sessions[sessionId].userId;
        const { firstname, lastname, password } = req.body;

        // 1. Update firstname & lastname in 'users' table
        await userModel.updateName(userID, firstname, lastname);

        // 2. If password is provided, update it in 'auth' table
        if (password && password.trim() !== "") {
            await authModel.updatePassword(userID, password);
        }

        res.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (err) {
        console.log(`[userController] updateProfile error: ${err}`);
        res.json({ success: false, message: "Server error" });
    }
}