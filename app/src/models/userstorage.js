"user strict";

// const fs = require("fs").promises;
const getConnection = require("../config/db");

class UserStorage{

    static test()
    {
        return new Promise( (resolve, reject) =>{
            getConnection( (conn) =>{
                conn.query("call testProc3(?);", "choejj", ( err ) =>{
                    if(err) reject (`${err}`);
                    resolve();
                });
                conn.release();
            });
        });
    }
    static getUserInfo(id){
        return new Promise(( resolve, reject ) =>{
            getConnection( (conn) =>{
                conn.query("SELECT * FROM account WHERE id = ?;", [id], (err, data )=>{
                    if(err) reject(`${err}`);
                    resolve( data[0] );
                });
                console.log("db conn release");
                conn.release();
            });
        });
    }

    static save( userInfo ,hashedpassword, salt ){
        return new Promise(( resolve, reject ) =>{
            getConnection( (conn) =>{
                conn.query("INSERT INTO account(id, name, psword, salt) VALUES(?, ?, ?, ?);", 
                    [userInfo.id,userInfo.name,hashedpassword, salt], (err )=>{
                        if(err){
                            reject(`${err}`);
                        } 
                        resolve( {success:true} );
                });
                conn.release();
            });
        });
    };
     
}

module.exports = UserStorage;


