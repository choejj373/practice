"use strict"

const UserStorage = require("./userstorage");
const Quest = require("../services/quest");

const crypto = require("crypto");


const createSalt = () => 
    new Promise(( resolve, reject) =>{
        crypto.randomBytes(64, (err,buf) => {
            if( err ) reject (err);
            resolve( buf.toString('base64'));
        });
    });


const createHashedPassword = ( plainPassword) =>
    new Promise( async(resolve, reject)=>{
        const salt = await createSalt();
        crypto.pbkdf2( plainPassword, salt, 2, 64, 'sha512', (err,key)=>{
            if ( err) reject (err);
            resolve( {password:key.toString('base64'), salt });
        });
    });

const makePasswordHashed = ( salt, plainPassword ) =>
    new Promise( async ( resolve, reject ) => {
        crypto.pbkdf2( plainPassword, salt, 2, 64, 'sha512' , ( err, key )=>{
            if( err ) reject ( err );
            resolve( key.toString('base64'));
        });
    });

class User{

    constructor(body){
        this.body = body;
        this.accountId = body.id;
    };
    
    async register(){
        console.log( "User.register");

        const client = this.body;
        const { password, salt } = await createHashedPassword( client.psword);
        // console.log( password );
        const result = await UserStorage.save( client, password, salt );

        console.log( result );
        if( result.success){
            Quest.createUserQuestAll( result.userId );
        }
        return result;
    };

    async login(){
        const body = this.body;

        const accountInfo = await UserStorage.getAccountInfo( this.accountId );
        console.log( accountInfo );

        if( accountInfo ){
            const hashedPwd = await makePasswordHashed( accountInfo.salt, body.psword );
            if( accountInfo.id === this.body.id && accountInfo.psword === hashedPwd){

                return { success : true, accountInfo : accountInfo };
            }
            return { success : false , msg : " 비밀번호가 틀렸습니다."}
        }
        return { success : false, msg : "존재하지 않는 아이디 입니다"}
    }   
}; 

module.exports = User;