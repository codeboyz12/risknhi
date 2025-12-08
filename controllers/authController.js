const { json } = require('express');
const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
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
