"user strict";

const mysql = require('mysql2/promise');

//const getConnection = require("../config/db");
const dbPool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PSWORD,
    database:process.env.DB_DATABASE,
    connectionLimit:10,
    multipleStatements: true,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, // false by default    
});

dbPool.on('release', () =>{
    console.log("db pool conn is released");
})

//use function for mysql module
function getConnection(callback){
    dbPool.getConnection( function(err, conn ){
        if(!err){
            callback(conn);
        }
    });
}

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
    static async getUserInfo(id){

        const conn = await dbPool.getConnection();
        let retVal;

        try{
            const [row] = await conn.query("SELECT * FROM account WHERE id = ?;", [id] );
            retVal = row[0];
        }catch( err ){
            console.log( err );
        }finally{
            await conn.release();
        }
        return retVal;
    }

    static async save( userInfo ,hashedpassword, salt ){
        const conn = await dbPool.getConnection();
        let retVal;
        try{
            // await conn.beginTransaction();
            const result = await conn.query("INSERT INTO account(id, name, psword, salt) VALUES(?, ?, ?, ?);", 
                     [userInfo.id,userInfo.name,hashedpassword, salt] );

            // await conn.commit();
            retVal = {success:true};
        }catch( err ){
            console.log( err );
            // await conn.rollback();
            retVal = {success:false};
        }finally{
            await conn.release();
        }

        return retVal;
    };

    static async getItems( user_id ){
        const conn = await dbPool.getConnection();
        let retVal = { success: false};
        try{
            const result = await conn.query("SELECT * FROM item_table WHERE owner = ?;", [user_id] );
            // console.log( result[0] );
            retVal.success = true;
            retVal.items = result[0];
        }catch(err)
        {
            console.log(err);
        }finally{
            await conn.release();
        }
        return retVal;
    };
    static async sellItem( user_id, item_uid ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{
            //owner == user_id 인지도 체크 필요
            const sql1 = "DELETE FROM item_table WHERE item_uid = ?;";
            const sql1s = mysql.format( sql1, item_uid );
            console.log( sql1s );

            //over flow check
            const price = 100;
            const sql2a = [ price, user_id ];
            const sql2 = "UPDATE account SET money = money + ? WHERE id = ?;";
            const sql2s = mysql.format( sql2, sql2a);

            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].changedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback");                            
                await conn.rollback();
            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            await conn.release();
        }
        return retVal;
    };

    // 뭔가 지저분 그냥 sp를 호출할까? 아님 money를 일단 가져올까?
    static async buyItem( user_id ){

        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{
            const sql1 = "INSERT INTO item_table (owner) values (?);";
            const sql1s = mysql.format( sql1, user_id );
            console.log( sql1s );

            const price = 100;
            const sql2a = [price, price, user_id]
            const sql2 = "UPDATE account SET money = if( money >= ?, money - ?, money) WHERE id = ?;";
            const sql2s = mysql.format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

            console.log( result );

            if( result[0][0].affectedRows > 0 && result[0][1].changedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback : ");                            
                await conn.rollback();
            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            await conn.release();
        }
        return retVal;
    };

    // underflow 체크 필요
    static async startSingleGame( user_id ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
            const result = await conn.query("UPDATE account SET battle_coin = if( battle_coin >= 1,battle_coin - 1, battle_coin) WHERE id = (?);", [user_id] );
            console.log( result[0] );
            if( result[0].changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            await conn.release();
        }
        return retVal;
    };

    // overflow 체크 필요
    static async addUserMoney( user_id, money ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
        
            const result = await conn.query("UPDATE account SET money = money + ? WHERE id = ?;", [money, user_id] );
            console.log( result[0] );
            if( result[0].changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            await conn.release();
        }
        return retVal;
    };
}


module.exports = UserStorage;


