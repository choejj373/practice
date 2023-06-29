"use strict";
const jwt = require('../../modules/jwt');

//const UserStorage = require("../../models/userstorage");
const User = require("../../models/user");
const UserStorage = require("../../models/userstorage");
const UserStorageCache = require("../../models/userstoragecache");

const output = {
    test : ( req,res )=>{
        UserStorage.test();
        res.render("home/test");
    },
    matchmaking : ( req,res)=>{
        res.render("home/matchmaking",{ sessionId : req.session.sessionId })
    },
    store : ( req,res )=> {
        res.render("home/store");
    },
    inventory : ( req,res )=> {
        res.render("home/inventory");
    },
    chat : (req,res)=>{
        res.render("home/chat");
    },
    home : async (req, res) => {
        
        console.log("output.home userId:", req.userId);

        const userInfo = await UserStorage.getUserInfo( req.userId );

        console.log( userInfo );

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
    },

    logout: (req,res) => {
        console.log("output.logout");
        // req.session.destroy();
        res.clearCookie('token');

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
        console.log( 'process.store : ', req.userId );
        const response = await UserStorage.buyItem( req.userId );
        if( response.success )
        {
            UserStorageCache.deleteItemAll(req.userId);
        }
        return res.json(response);
    },
    inventory_sell_item: async(req,res)=>{
        console.log( 'process.inventory_sell_item : ', req.body.item_uid );
        const response = await UserStorage.sellItem( req.userId, req.body.item_uid );
        if( response.success )
        {
            UserStorageCache.deleteItemAll(req.userId);
        }
        return res.json(response);
    },
    inventory_get_all: async(req,res)=>{
        console.log( 'process.inventory_get_all : ', req.userId );

        let response;
        response = await UserStorageCache.getItemAll( req.userId )
        console.log( response.success );
        if( response.success === true)
        {
            console.log("Cache Hit");
        }else{
            console.log("Cache no hit");
            response = await UserStorage.getItems( req.userId );
            if( response.success )
            {
                // console.log( response );
                UserStorageCache.saveItemAll( req.userId, response.items );
            }
        }
        return res.json(response);
    },
    login: async(req, res) => { 
        console.log( "process.login" );
        const user = new User( req.body );
        const response = await user.login();
        console.log( response );
        if( response.success )
        {
            const jwtToken = await jwt.sign( user.userId );
            
            const cookieOption = {
                httpOnly: true,
                maxAge : 600000,
                secure : false,
                // 1 more
            }

            res.cookie( 'token', jwtToken.token, cookieOption );


            return res.json( { success:true, token: jwtToken.token });

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
            console.log( "process.startsinglegame : ", req.userId );
            const response = await UserStorage.startSingleGame( req.userId );
            // todo : session -> jwt 로 세션에 저장하던 임시 정보를 별도로 처리 필요
            // req.session.isStartSingleGame = true;
            return res.json(response);
        },
    endsinglegame : async(req,res)=>{
        console.log( 'delete endsinglegame : ', req.userId );

        let response = { success:false};
        
        console.log(req.isStartSingleGame);

        // if( req.session.isStartSingleGame ){
            response = await UserStorage.addUserMoney( req.userId, 100 );
            // req.session.isStartSingGame = false;
        // }
        return res.json( response );
    },
    
}

module.exports = {
    output,
    process,
};
