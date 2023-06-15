"use strict";

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");

const output = {
    home : (req, res) => {
        console.log( req.sessionID, req.session );
        if( req.session.isLogined ){
            res.render("home/index");
        }else{
            res.render("home/login");        
        }
    },
    login : (req, res) => {
        res.render("home/login");
    },
    register : ( req, res) => {
        res.render("home/register");
    }
}
const process = {
    login: async(req, res) => {
        const user = new User( req.body );
        const response = await user.login();
        if( response.success )
        {
            req.session.isLogined = true;
            req.session.save( function(){
                return res.json(response);  
            });
        }
        return res.json(response)},
    register: async( req, res) => {
        const user = new User( req.body );
        const response = await user.register();
        return res.json(response)},

}

module.exports = {
    output,
    process,
};
