const { json } = require('express');
const authModel = require('../models/authModel');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const {username, password, firstname, lastname} = req.body;
        const userID = await authModel.insert(username, password);
        await userModel.insert(userID, firstname, lastname);

        return userID;
    } catch (err) {
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
        res.send({"status": "Users not found"});
    }

    if (password == row.password) {
        console.log("Login success");
        res.send({"status": "login success"});
    } else {
        console.log("Login unsuccess");
        res.send({"status": "wrong password"});
    }
}