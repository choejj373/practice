"use strict";

const UserStorage = require("../../models/userstorage");

const output = {
    home : (req, res) => {
        res.render("home/index");
    },
    login : (req, res) => {
        res.render("home/login");
    }
}
const process = {
    login: (req, res) => {
        const id = req.body.id,
        psword = req.body.psword;

        const users = UserStorage.getusers( "id", "psword" );
        //console.log( users );

        if( users.id.includes( id )){
             const idx = users.id.indexOf(id);
             if( users.psword[ idx ] === psword ){
                 return res.json({
                     success:true,
                 });
             };
         };

         return res.json({
             success: false,
             msg: "login failed"
         });
    },
}

module.exports = {
    output,
    process,
};
