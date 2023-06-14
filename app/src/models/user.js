"use strict"

const UserStorage = require("./userstorage");

class User{
    constructor(body){
        this.body = body;
    };

    login(){
        // console.log("start User.login");
        const body = this.body;
        
        // console.log("Start call UserStorage.getUserInfo : " + body.id );

        const { id, psword } = UserStorage.getUserInfo( body.id );

        // console.log("End call UserStorage.getUserInfo");

        // if( userInfo.id ){
        if( id ){
            if( id === this.body.id && psword === this.body.psword){
                return { success : true };
            }
            return { success : false , msg : " 비밀번호가 틀렸습니다."}
        }
        return { success : false, msg : "존재하지 않는 아이디 입니다"}
    }   
};

module.exports = User;