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

    static save( userInfo ){

        return new Promise(( resolve, reject ) =>{
            db.query("INSERT INTO account(id, name, psword) VALUES(?, ?, ?);", 
                [userInfo.id,userInfo.name,userInfo.psword], (err )=>{
                    if(err) reject(`${err}`);
                    resolve( {success:true} );
            });
        });
      
    }
}

module.exports = UserStorage;


