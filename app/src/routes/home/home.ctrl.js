"use strict";

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");

const output = {
    home : (req, res) => {
        res.render("home/index");
    },
    login : (req, res) => {
        res.render("home/login");
    },
    register : ( req, res) => {
        res.render("home/register");
    }
}
const process = {
    login: (req, res) => {
        const user = new User( req.body );
        const response = user.login();
        return res.json(response)},

    register:( req, res) => {
        return {};
    },
 
}

module.exports = {
    output,
    process,
};
