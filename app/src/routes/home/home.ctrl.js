"use strict";

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");
const UserStorage = require("../../models/userstorage");

const output = {
    test : ( req,res )=>{
        UserStorage.test();
        res.render("home/test");
    },
    store : ( req,res )=> {
        if( req.session.isLogined ){
            res.render("home/store");
        }else{
            res.redirect("/login");        
        }
    },
    inventory : ( req,res )=> {
        if( req.session.isLogined ){
            res.render("home/inventory");
        }else{
            res.redirect("/login");        
        }
    },
    chat : (req,res)=>{
        res.render("home/chat");
    },
    home : (req, res) => {
        console.log( req.session.isLogined );
        if( req.session.isLogined ){
            console.log( "output.home logined" );
            res.render("home/index");
        }else{
            console.log( "output.home not logined" );
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
    store: async(req,res)=>{
        console.log( 'process.store : ', req.session.user_id );
        const response = await UserStorage.buyItem( req.session.user_id );
        if( response.success )
        {
            console.log( JSON.stringify(response.items ) );
        }
        return res.json(response);
    },
    inventory: async(req,res)=>{
        console.log( 'process.inventory : ', req.session.user_id );
        const response = await UserStorage.getItems( req.session.user_id );
        if( response.success )
        {
            console.log( JSON.stringify(response.items ) );
        }
        return res.json(response);
    },
    login: async(req, res) => {
        console.log( "process.login" );
        const user = new User( req.body );
        const response = await user.login();
        if( response.success )
        {
            req.session.isLogined = true;
            req.session.user_id = req.body.id;

            req.session.save( () => {
                // return res.json(response);  
            });
        }
        return res.json(response)},
    register: async( req, res) => {
        console.log( "process.register" );
        const user = new User( req.body );
        let response;
        try{
            response = await user.register();
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)},

}

module.exports = {
    output,
    process,
};
