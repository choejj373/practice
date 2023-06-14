"use strict";
const users ={
    id: ["choejj", "choejj373", "choejj123"],
    psword: ["111", "123", " 134"],
};

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
//        console.log( req.body );
        const id = req.body.id,
        psword = req.body.psword;

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
