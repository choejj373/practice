"use strict";

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");
const UserStorage = require("../../models/userstorage");
const UserStorageCache = require("../../models/userstoragecache");

const output = {
    test : ( req,res )=>{
        UserStorage.test();
        res.render("home/test");
    },
    store : ( req,res )=> {
        if( req.session.key ){
            res.render("home/store");
        }else{
            res.redirect("/login");        
        }
    },
    inventory : ( req,res )=> {
        if( req.session.key ){
            res.render("home/inventory");
        }else{
            res.redirect("/login");        
        }
    },
    chat : (req,res)=>{
        if( req.session.key ){
            res.render("home/chat");
        }else{
            res.redirect("/login");        
        }
    },
    home : async (req, res) => {
        console.log( req.session.isLogined );
        if( req.session.key ){
            console.log( "output.home logined - ", req.session.user_name );

            const userInfo = await UserStorage.getUserInfo( req.session.user_id );

            if( userInfo ){
                res.render("home/index",{
                    user_name: userInfo.name,
                    user_money : userInfo.money,
                    battle_coin : userInfo.battle_coin,
                });
            }else{
                res.render("home/index",{
                    user_name: "",
                    user_money : 0,
                    battle_coin : 0,
                });
            }

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
    },
    singlegame : ( req, res)=>{
        console.log( "singlegame");
        res.render("home/singlegame");
    }
}

const process = {
    store: async(req,res)=>{
        console.log( 'process.store : ', req.session.user_id );
        const response = await UserStorage.buyItem( req.session.user_id );
        if( response.success )
        {
            UserStorageCache.deleteItemAll(req.session.user_id);
        }
        return res.json(response);
    },
    inventory_sell_item: async(req,res)=>{
        console.log( 'process.inventory_sell_item : ', req.body.item_uid );
        const response = await UserStorage.sellItem( req.session.user_id, req.body.item_uid );
        if( response.success )
        {
            UserStorageCache.deleteItemAll(req.session.user_id);            
        }
        return res.json(response);
    },
    inventory_get_all: async(req,res)=>{
        console.log( 'process.inventory_get_all : ', req.session.user_id );

        let response;
        response = await UserStorageCache.getItemAll( req.session.user_id )
        console.log( response.success );
        if( response.success === true)
        {
            console.log("Cache Hit");
        }else{
            console.log("Cache no hit");
            response = await UserStorage.getItems( req.session.user_id );
            if( response.success )
            {
                // console.log( response );
                UserStorageCache.saveItemAll( req.session.user_id, response.items );
            }
        }
        return res.json(response);
    },
    login: async(req, res) => { 
        console.log( "process.login" );
        const user = new User( req.body );
        const response = await user.login();
        if( response.success )
        {
            // console.log( response );
            req.session.key = req.body.id;
            req.session.user_id = req.body.id;
            req.session.user_name = response.name;

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
    startsinglegame : async( req, res)=>{
            console.log( "process.startsinglegame : ", req.session.user_id );
            const response = await UserStorage.startSingleGame( req.session.user_id );
            req.session.isStartSingleGame = true;
            return res.json(response);
        },
    endsinglegame : async(req,res)=>{
        console.log( 'delete endsinglegame : ', req.session.user_id );

        let response = { success:false};
        if( req.session.isStartSingleGame ){
            response = await UserStorage.addUserMoney( req.session.user_id, 100 );
            req.session.isStartSingGame = false;
        }
        return res.json( response );
    },
    
}

module.exports = {
    output,
    process,
};
