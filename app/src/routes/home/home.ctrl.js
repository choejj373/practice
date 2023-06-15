"use strict";

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");

const output = {
    home : (req, res) => {
        console.log( req.session.isLogined );
        if( req.session.isLogined ){
            console.log( "output.home logined" );
            res.render("home/index");
        }else{
            console.log( "output.home not logined" );
            // res.render("home/login");        
            res.redirect("/login");
        }
    },
    logout: (req,res) => {
        console.log("output.logout");
        req.session.destroy();
        res.render("home/logout");
    },
    login : (req, res) => {
        console.log( "output.login" );
        res.render("home/login");
    },
    register : ( req, res) => {
        console.log( "output.register" );
        res.render("home/register");
    }
}
const process = {
    login: async(req, res) => {
        console.log( "process.login" );
        const user = new User( req.body );
        const response = await user.login();
        if( response.success )
        {
            req.session.isLogined = true;
            req.session.save( () => {
                // return res.json(response);  
            });
        }
        return res.json(response)},
    register: async( req, res) => {
        console.log( "process.register" );
        const user = new User( req.body );
        const response = await user.register();
        return res.json(response)},

}

module.exports = {
    output,
    process,
};
