"use strict";
const passport = require('passport');
const crypto = require("crypto");

const jwt = require('../../modules/jwt');
const User = require("../../models/user");
const UserStorage = require("../../models/userstorage");
const UserStorageCache = require("../../models/userstoragecache");
const Quest = require("../../services/quest");
const Secret = require("../../services/secret")


const { default: axios } = require('axios');
const url = require('url');



const CLIENT_ID = "145681489601-h711k94pqvn4d5i1kod2u8aqa5fauo4s.apps.googleusercontent.com";
const CLIENT_SECRET = "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"
const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URL = "http://localhost:3000/auth/google/callback";
const RESPONSE_TYPE = "code";
const SCOPE = "openid%20profile%20email";
const ACCESS_TYPE = "offline";
const OAUTH_URL = `${AUTHORIZE_URI}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URL}&scope=${SCOPE}&access_type=${ACCESS_TYPE}`;

const getToken = async ( code ) => {
    try{
        const tokenApi = await axios.post(
            `https://oauth2.googleapis.com/token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&grant_type=authorization_code`
        );

        const accessToken = tokenApi.data.access_token;

        return accessToken;
    }catch(err){
        return err;
    }
};

const getUserInfo = async ( accessToken) =>{
    try{
        const userInfoApi = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?alt=json`,
            {
                headers:{
                    authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return userInfoApi;
    }catch( err ){
        return err;
    }
}

const oauth2Api = async(code)=>{
    const accessToken = await getToken(code);
    const userInfo = await getUserInfo(accessToken) ;
    return userInfo.data;
}


const output = {
    test : ( req,res )=>{
        UserStorage.test();
        res.render("home/test");
    },
    matchmaking : ( req,res)=>{
        res.render("home/matchmaking",{ sessionId : req.session.sessionId })
    },
    // store : ( req,res )=> {
    //     res.render("home/store");
    // },
    inventory : ( req,res )=> {
        res.render("home/inventory");
    },
    chat : (req,res)=>{
        res.render("home/chat");
    },
    home : async (req, res) => {
        
        console.log("output.home userId:", req.userId);
        //check token
        res.render("home/index")
    },

    // logout: (req,res) => {
    //     console.log("output.logout");
    //     // req.session.destroy();
    //     res.clearCookie('token');

    //     res.render("home/logout");
    // },
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

    //대칭키는 항상 개인키로 암호화 하여 보낸다.
    getSymmetricKey : ( req, res ) => {
        const key = Secret.getSymmetricKeyEncodedByPrivateKey();
        return res.json( { success:true, symmeticKey: `${key}` } );
    },
    getPublicKey : ( req, res ) => {
        const publicKey = Secret.getPublicKey();
        return res.json( { success:true, publicKey: `${publicKey}` } );
    },
    checkToken :( req,res )=>{
        return res.json( { success:true } );
    }, 
    requireQuestReward : async ( req, res)=>{
        console.log( 'process.requireQuestReward : ', req.userId );
        const response = await Quest.rewardQuestReward( req.userId, req.body.questId, req.body.questIndex );
        return res.json( response );
    },
    getUserNormalQuestInfo : async( req, res)=>{
        console.log( 'process.getUserNormalQuestInfo : ', req.userId );
        const response = await Quest.getUserNormalQuestInfo( req.userId );
        return res.json( response );
    },
    getUserDailyQuestInfo : async( req, res)=>{
        console.log( 'process.getUserDailyQuestInfo : ', req.userId );
        const response = await Quest.getUserDailyQuestInfo( req.userId );
        return res.json( response );
    },
    getUserWeeklyQuestInfo : async( req, res)=>{
        console.log( 'process.getUserWeeklyQuestInfo : ', req.userId );
        const response = await Quest.getUserWeeklyQuestInfo( req.userId );
        return res.json( response );
    },
    equipItem : async( req, res)=>{

        console.log( 'process.equipItem : ', req.userId );
        console.log( req.body )        ;

        let response = await UserStorage.equipItem( req.userId, req.body.itemUid );

        return res.json(response);
    },
    unEquipItem : async( req, res)=>{
        console.log( 'process.equipItem : ', req.userId );
        console.log( req.body )        ;

        let response = await UserStorage.unEquipItem( req.userId, req.body.itemUid );

        return res.json(response);
    },

    diamondstore: async( req, res)=>{
        console.log( 'process.diamondstore : ', req.userId );
        console.log( req.body )        ;

        const price = 10;
        let response = await UserStorage.buyItemByDia( req.userId, req.body.itemType, price );

        Quest.processUseDiamond( req.userId, price );

        return res.json(response);
    },
    dailystore: async(req,res)=>{
        console.log( 'process.dailystore : ', req.userId );
        console.log( req.body )        ;

        let response = { success:false };

        const result = await UserStorage.isSoldOutDailyStore( req.userId, req.body.type )
        console.log( result );

        if( result.success ){
            response.msg = result.msg;
            return res.json(response);
        }

        switch( req.body.type )
        {
        case 1://무료 다이아
            response = await UserStorage.getFreeDiamond( req.userId );
            break;
        case 2://골드 구입 아이템
            break;
        default://기타
            break;
        }

        return res.json(response);
    },
    sellItem: async(req,res)=>{
        console.log( 'process.sellItem : ', req.body.itemUid );
        const response = await UserStorage.sellItem( req.userId, req.body.itemUid );
        if( response.success )
        {
            UserStorageCache.deleteItemAll(req.userId);
        }
        return res.json(response);
    },
    getItemAll: async(req,res)=>{
        console.log( 'process.getItemAll : ', req.userId );

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
        

        req.body.id = Secret.getValueDecodedByPrivateKey( req.body.id );
        req.body.psword = Secret.getValueDecodedByPrivateKey( req.body.psword );

        const user = new User( req.body );
        const response = await user.login();

        if( response.success )
        {
            console.log( response.accountInfo );
            const jwtToken = await jwt.sign( response.accountInfo );
            
            const cookieOption = {
                httpOnly: true,
                maxAge : 1000 * 60 * 60,
                secure : false,
                // 1 more
            }

            res.cookie( 'token', jwtToken.token, cookieOption );
// todo user_id를 가져온다;;;
            Quest.processLogin( response.accountInfo.user_id );

            return res.json( { success:true, token: jwtToken.token });

        }
        return res.json(response)},
    
    guestRegister : async( req, res) => {
        console.log( "process.guestRegister" );
        const user = new User( req.body );
        let response;
        try{
            response = await user.guestRegister();
            console.log( response );
        }
        catch( err )
        {
            console.log( err );
        }
        return res.json(response)
    },
    guestLogin : async( req, res ) => {
        console.log( "process.guestLogin" );

        const user = new User( req.body );

        console.log( req.body.guestId );
        const response = await user.guestLogin( req.body.guestId );

        if( response.success )
        {
            console.log( response.accountInfo );
            const jwtToken = await jwt.sign( response.accountInfo );
            
            const cookieOption = {
                httpOnly: true,
                maxAge : 1000 * 60 * 60,
                secure : false,
                // 1 more
            }

            res.cookie( 'token', jwtToken.token, cookieOption );
// todo user_id를 가져온다;;;
            Quest.processLogin( response.accountInfo.user_id );

            return res.json( { success:true, token: jwtToken.token });

        }
        return res.json(response)
    },
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
    logout : (req, res) =>{
        console.log("output.logout");

        res.clearCookie('token');

        return res.json( {success:true});
    },
    getuserinfo : async ( req,res ) =>{
        console.log("get process.home userId:", req.userId);

        const userInfo = await UserStorage.getUserInfo( req.userId );

        if( userInfo ){
            return res.json( {success:true, 
                userName: userInfo.name,
                userMoney : userInfo.money,
                battleCoin : userInfo.battle_coin,
                diamond : userInfo.diamond,
                exp : userInfo.exp,
            });

        }else{
            return res.json( {success:false, msg:"not found user"})
        }
    },
    getTradeDailyStore : async ( req, res )=>{
        console.log("get process.home userId:", req.userId);

        const tradeInfo = await UserStorage.getTradeDailyStore( req.userId );

        console.log( tradeInfo );

        const nowTime = new Date().getTime();

        let response = { success:true, tradeList:[] }

        if( Array.isArray( tradeInfo ) && tradeInfo.length > 0 ){
            tradeInfo.forEach( (trade)=>{
                let expireTime = new Date( trade.expire_time ).getTime();
                
                console.log( nowTime," ", trade.expire_time );

                if( expireTime > nowTime )
                {
                    response.tradeList.push( trade );
                }else{
                    UserStorage.deleteTradeDailyStore( req.userId, trade.id );
                }

            })
        }
        return res.json( response );
    },
    googleLogin : async ( req, res )=>{
        console.log("googleLogin")
        res.redirect(OAUTH_URL);
    },
    googleRedirect : async ( req, res )=>{
        console.log("googleRedirect")

        const query = url.parse( req.url, true ).query;
        if( query && query.code ){
            const userInfo = oauth2Api( query.code);
            //1. userInfo로 DB에 user를 찾아보고 없다면 새로 생성
            //2. token을 새로 만들어서 클라이언트에게 알려줌..
            //3. res.redirect에 token을 넣어서 보내준다.
        }

        res.redirect("/");
    }

}

module.exports = {
    output,
    process,
};
