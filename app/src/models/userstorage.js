"user strict";

// const fs = require("fs").promises;
const db = require("../config/db");

class UserStorage{


    static getUserInfo(id){

        return new Promise(( resolve, reject ) =>{
            db.query("SELECT * FROM account WHERE id = ?;", [id], (err, data )=>{
                if(err) reject(`${err}`);
                console.log(data[0]);
                resolve( data[0] );
            });
        });
    }

    static save( userInfo ,hashedpassword, salt ){

        return new Promise(( resolve, reject ) =>{
            db.query("INSERT INTO account(id, name, psword, salt) VALUES(?, ?, ?, ?);", 
                [userInfo.id,userInfo.name,hashedpassword, salt], (err )=>{
                    if(err) reject(`${err}`);
                    resolve( {success:true} );
            });
        });
      
    }
}

module.exports = UserStorage;


