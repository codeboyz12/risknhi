const { json } = require('express');
const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const patientModel = require('../models/patientModel');
const crypto = require("crypto");
const sessions = require('../variable/variable');

exports.register = async (req, res) => {
    try {
        const {username, password, firstname, lastname} = req.body;
        const userID = await authModel.insert(username, password);
        await userModel.insert(userID, firstname, lastname);

        res.json({
            success: true,
            userId: userID
        });
        return userID;
    } catch (err) {
        res.json({
            success: false,
        });
        console.log(`Register error ${err}`);
    }
}

exports.getAllAuth = async (req, res) => {
    const row = await authModel.selectAll();
    res.json(row);
}

exports.getAuthByUsername = async (req, res) => {
    const {username} = req.body;
    const row = await authModel.selectByUsername(username);
    console.log(row);
    res.json(row);
}

exports.login = async (req, res) => {
    const {username, password} = await req.body;
    const row = await authModel.selectByUsername(username);
    if (!row) {
        console.log("Users not found");
        res.json({
            success: false,
            message: "Invalid Users."
        });
        return 1;
    }

    if (password == row.password) {
        console.log("Login success");
        const sessionId = crypto.randomBytes(16).toString("hex");
        sessions[sessionId] = {
            userId: row.userID,
            created: Date.now()
        };
        console.log(sessions);
        res.cookie("sessionId", sessionId, { httpOnly: true }).json({
            success: true,
            userId: row.userID,
            sessionId
        });
    } else {
        console.log("Login unsuccess");
        res.json({
            success: false,
            message: "Invalid Password."
        });
    }
}

exports.logout = async (req, res) => {
    const sessionId = req.cookies?.sessionId;

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        res.clearCookie('sessionId');
        return res.json({ success: true });
    }

    res.status(400).json({ success: false, message: "No active session" });
};

exports.deleteAccount = async (req, res) => {
    try {
        const { session } = req.body;
        const userID = sessions[session].userId;
        
        if (!userID) {
            return res.json({ success: false, message: "UserID is required" });
        }

        // 1. ลบประวัติการป่วยก่อน (Cleanup)
        await patientModel.deleteByUserID(userID);

        // 2. ลบ Account หลัก (Auth + Users)
        const affectedRows = await authModel.delete(userID);

        if (affectedRows > 0) {
            res.json({
                success: true,
                message: "Account deleted successfully"
            });
        } else {
            res.json({
                success: false,
                message: "User not found"
            });
        }

    } catch (err) {
        console.log(`[authController] Delete error: ${err}`);
        res.json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.selectUsernameById = async (req, res) => {
    try {
        const {userID} = req.body;
        
        console.log(`[authController] Fetch usersname ID: ${userID}`);

        const username = await authModel.selectUsernameById(userID);

        console.log(username);
        
        if( !username ){
            console.log(`[authController] Get username by ID not found`);
            res.json({ success: false });
        }else {
            console.log(`[authController] Get username by ID`);
            res.json({
                success: true,
                data: username
            });
        }
    } catch(err){
        console.log(`[authController] Fetch usersname error: ${err}`);
        res.json({
            success: false,
            message: err
        });
    }
}