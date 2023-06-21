"use strict"

const UserStorage = require("./userstorage");
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
    };
    
    async register(){
        const client = this.body;
        const { password, salt } = await createHashedPassword( client.psword);
        console.log( password );
        return UserStorage.save( client, password, salt );
    };

    async login(){
        const body = this.body;

        const userInfo = await UserStorage.getUserInfo( body.id );
        // console.log( userInfo );
        if( userInfo ){

            const hashedPwd = await makePasswordHashed( userInfo.salt, body.psword );
            if( userInfo.id === this.body.id && userInfo.psword === hashedPwd){

                return { success : true, name : userInfo.name };
            }
            return { success : false , msg : " 비밀번호가 틀렸습니다."}
        }
        return { success : false, msg : "존재하지 않는 아이디 입니다"}
    }   
}; 

module.exports = User;