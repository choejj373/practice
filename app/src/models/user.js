"use strict"

const UserStorage = require("./userstorage");

class User{
    constructor(body){
        this.body = body;
    };
    
    register(){
        const client = this.body;
        return UserStorage.save( client );


    };

    async login(){
        const body = this.body;
        // await UserStorage.getUserInfo( body.id );
        const { id, psword } = await UserStorage.getUserInfo( body.id );

        // console.log( "user.log():" + id + psword );
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