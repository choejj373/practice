"user strict";

const mysql = require('mysql');
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

    static getItems( user_id ){
        return new Promise(( resolve, reject )=>{
            getConnection( (conn) =>{
                conn.query("SELECT * FROM item_table WHERE owner = ?;", [user_id],
                (err,data)=>{
                    if( err ) reject(`${err}`);
                    // console.log( data );
                    resolve( {success:true, items:data} );
                });
                conn.release();
            });
        });
    };
    static sellItem( user_id, item_uid ){
        return new Promise(( resolve, reject)=>{
            getConnection((conn)=>{
                try{
                    //owner == user_id 인지도 체크 필요
                    const sql1 = "DELETE FROM item_table WHERE item_uid = ?;";
                    const sql1s = mysql.format( sql1, item_uid );
                    console.log( sql1s );

                    //over flow check
                    const sql2 = "UPDATE account SET money = money + 100 WHERE id = ?;";
                    const sql2s = mysql.format( sql2, user_id);

                    console.log( sql2s );
                    conn.query( sql1s + sql2s,
                        (err,result)=>{
                            console.log( result[0] );
                            console.log( result[1] );                        
                            if( err ) reject(`${err}`);
                            if( result[0].affectedRows > 0 && result[1].changedRows > 0 ) {
                                console.log( "commit");
                                conn.commit();
                                resolve( {success:true});
                            }else{
                                console.log( "rollback");                            
                                conn.rollback();
                                resolve( {success:false});
                            }
                        });
       
                    } catch( err ){
                        console.log( "rollback : ", err );
                        conn.rollback();
                        resolve( { success:false});
                    } finally{
                        console.log( "finally");
                        conn.release();
                    }
            });
        }); 
    };

    // 뭔가 지저분 그냥 sp를 호출할까? 아님 money를 일단 가져올까?
    static buyItem( user_id ){
        return new Promise(( resolve, reject)=>{
            getConnection((conn)=>{
                try{
                    conn.beginTransaction();
                    console.log("begin transaction");

                    const sql1 = "INSERT INTO item_table (owner) values (?);";
                    const sql1s = mysql.format( sql1, user_id );
                    console.log( sql1s );

                    // const price = 100;
                    const sql2 = "UPDATE account SET money = if( money >= 100, money - 100, money) WHERE id = ?;";
                    const sql2s = mysql.format( sql2, user_id);

                    console.log( sql2s );
                    conn.query( sql1s + sql2s,
                    (err,result)=>{
                        console.log( result[0] );
                        console.log( result[1] );                        
                        if( err ) reject(`${err}`);
                        if( result[0].affectedRows > 0 && result[1].changedRows > 0 ) {
                            console.log( "commit");
                            conn.commit();
                            resolve( {success:true});
                        }else{
                            console.log( "rollback : ");                            
                            conn.rollback();
                            resolve( {success:false});
                        }
                    });


                } catch( err ){
                    console.log( "rollback : ", err );
                    conn.rollback();
                    resolve( { success:false});
                } finally{
                    console.log( "finally");
                    conn.release();
                }
            });
        });
    };

    // underflow 체크 필요
    static startSingleGame( user_id ){
        return new Promise(( resolve, reject)=>{
            getConnection((conn)=>{
                conn.query("UPDATE account SET battle_coin = if( battle_coin >= 1,battle_coin - 1, battle_coin) WHERE id = (?);", [user_id],
                (err,result)=>{
                    console.log( result );
                    if( err ) reject(`${err}`);
                    if( result.changedRows === 0 ) resolve({success:false})
                    resolve( {success:true});
                });
                
                conn.release();
            });
        });
    };

    // overflow 체크 필요
    static addUserMoney( user_id, money ){
        return new Promise(( resolve, reject)=>{
            getConnection((conn)=>{
                conn.query("UPDATE account SET money = money + ? WHERE id = ?;", [money, user_id],
                (err,result)=>{
                    if( err ) reject(`${err}`);
                    resolve( {success:true});
                });
                conn.release();
            });
        });
    };
}

module.exports = UserStorage;


