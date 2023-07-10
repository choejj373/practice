"use strict";

const { dbPool, mysql }  = require("../config/db");

//use function for mysql module
// function getConnection(callback){
//     dbPool.getConnection( function(err, conn ){
//         if(!err){
//             callback(conn);
//         }
//     });
// }

class UserStorage{

    static test()
    {
        // return new Promise( (resolve, reject) =>{
        //     getConnection( (conn) =>{
        //         conn.query("call testProc3(?);", "choejj", ( err ) =>{
        //             if(err) reject (`${err}`);
        //             resolve();
        //         });
        //         conn.release();
        //     });
        // });
    }
    // 5분마다 1씩 충전되는 battleCoin에 대한 처리 : 유저 정보를 가져가거나 사용전 호출 필요
    static async updateBattleCoin( user_id ){
        const conn = await dbPool.getConnection();

        try{
            const [row] = await conn.query("SELECT battle_coin, update_time FROM user WHERE id = ?;", [user_id] );
            console.log( row );
            
            if( Array.isArray(row) && row.length === 0 ) {
                console.log("not found : ", user_id );
            }else{
    
                const maxBattleCoin = 100;
    
                const nowDateUTC = new Date();//.now().getTime();
                const updateDateUTC = new Date( row[0].update_time );
    
                // console.log( nowDateUTC );
                // console.log( updateDateUTC );
    
                const nowTimeUTC = nowDateUTC.getTime();
                const updateTimeUTC = updateDateUTC.getTime();
                const elapsedTime = nowTimeUTC - updateTimeUTC;
                
                // console.log( nowTimeUTC );
                // console.log( updateTimeUTC );
                // console.log( elapsedTime );
                
                const elapsedCount  = parseInt( elapsedTime / ( 1000 * 60 * 5 ) );//5분마다 1번
    
                // console.log( "elapsedCount : ", elapsedCount);
    
                if( row[0].battle_coin < maxBattleCoin )
                {
                    if( elapsedCount > 0 )
                    {
                        let newBattleCoin = row[0].battle_coin + elapsedCount;
    
                        if( newBattleCoin > maxBattleCoin ){ newBattleCoin = maxBattleCoin;}
                        console.log( "new battle coin : ", newBattleCoin );
    
                        const result1 = await conn.query("UPDATE user SET battle_coin = ?, update_time = DATE_ADD( update_time, INTERVAL ? MINUTE) WHERE id = ?",
                                            [ newBattleCoin, elapsedCount  * 5, user_id ]);
    
                        // console.log( result1 );
                    }
                    else
                    {
                        console.log("time is not enough");
                    }
                }
                else
                {
                    console.log("battle coin is full : ", row[0].battle_coin );

                    const result1 = await conn.query("UPDATE user SET update_time = ? WHERE id = ?",
                                [ new Date(), user_id ]);
    
                    // console.log( result1 );
                }
            }
        }catch( err ){
            console.log( err );
        }finally{
            conn.release();
        }        
    }

    static async deleteTradeDailyStore( userId, tradeId )
    {
        const conn = await dbPool.getConnection();

        try{
            conn.query("delete from trade_daily_store where id = ? AND owner = ?;", 
                        [ tradeId, userId] );

        }catch( err ){
            console.log( err );
        }finally{
            conn.release();
        }
    }
    static async getTradeDailyStore( user_id ){
        const conn = await dbPool.getConnection();
        let retVal = [];

        try{
            const [row] = await conn.query("select * from trade_daily_store where owner = ?;", [user_id] );

            retVal = row;
        }catch( err ){
            console.log( err );
        }finally{
            conn.release();
        }
        return retVal;
    }


    static async getAccountInfo(id){

        // await UserStorage.updateBattleCoin( id );

        const conn = await dbPool.getConnection();
        let retVal = null;

        try{
            const [row] = await conn.query("select * from account where account.id = ?;", [id] );
            console.log( row );
            retVal = row[0];
        }catch( err ){
            console.log( err );
        }finally{
            conn.release();
        }
        return retVal;
    }

    static async getUserInfo(id){

        await UserStorage.updateBattleCoin( id );

        const conn = await dbPool.getConnection();
        let retVal;

        try{
            const [row] = await conn.query("SELECT * FROM user WHERE id = ?;", [id] );
            retVal = row[0];
        }catch( err ){
            console.log( err );
        }finally{
            conn.release();
        }
        return retVal;
    }

    static async save( accountInfo ,hashedpassword, salt ){
        
        console.log( "UserStorage.save");

        const conn = await dbPool.getConnection();
        let retVal;
        try{


            const sql1 = "INSERT INTO user( name ) VALUES (?);";
            const sql1a = [ accountInfo.name ];
            const sql1s = mysql.format( sql1, sql1a);
            console.log( sql1 );

            const sql2 = "INSERT INTO account(id, name, psword, salt, user_id) VALUES(?, ?, ?, ?, LAST_INSERT_ID());";
            const sql2a = [accountInfo.id,accountInfo.name,hashedpassword, salt];
            const sql2s = mysql.format( sql2, sql2a );
            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback");                            
                await conn.rollback();
            }
         
            await conn.commit();
            retVal = {success:true};
            const [row] = await conn.query("SELECT user_id FROM account WHERE id = ?;", [accountInfo.id] );

            if( row.length > 0 ){
                retVal.userId = row[0].user_id;
            }

        }catch( err ){
            console.log( err );
            await conn.rollback();
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
            conn.release();
        }
        return retVal;
    };
    static async sellItem( user_id, item_uid ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{
            const sql1 = "DELETE FROM item_table WHERE item_uid = ? AND owner = ?;";
            const sql1a = [ item_uid, user_id ];
            const sql1s = mysql.format( sql1, sql1a );
            console.log( sql1s );

            //over flow check
            const price = 100;
            const sql2a = [ price, user_id ];
            const sql2 = "UPDATE user SET money = money + ? WHERE id = ?;";
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
            conn.release();
        }
        return retVal;
    };

    static async isSoldOutDailyStore( user_id, type){
        const conn = await dbPool.getConnection();
        let retVal = { success:true , msg:'sold out'};
        
        try{
            const sql1 = "SELECT * FROM trade_daily_store WHERE owner = ? and type = ?";
            const sql1a = [user_id, type]
            const sql1s = mysql.format( sql1, sql1a );
            console.log( sql1s );

            const [row] = await conn.query( sql1s );

            if( Array.isArray(row) && row.length === 0 ) {
                retVal = {success:false};
            }
        } catch( err ){
            console.log( err );
        } finally{
            console.log( "finally");
            conn.release();
        }
        return retVal;
    }

    static async getFreeDiamond( user_id ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };

        try{

    
            const nowDate = new Date();
            const expireDate = new Date( nowDate.setHours( 24,0,0,0 ) );

            console.log( expireDate );

            const freeDiamond = 100;
            const sql1 = "INSERT INTO trade_daily_store (owner, type, value, expire_time ) values (?,?,?,?);";
            const sql1a = [user_id, 1, freeDiamond, expireDate ]
            const sql1s = mysql.format( sql1, sql1a );
            console.log( sql1s );

            
            const sql2a = [freeDiamond, user_id]
            const sql2 = "UPDATE user SET diamond = diamond + ? WHERE id = ?;";
            const sql2s = mysql.format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

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
            conn.release();
        }
        return retVal;
    };

    static async unEquipItemSameType( userId, itemId )
    {
        console.log( "unEquipItemSameType : ", userId," ", itemId)
        const conn = await dbPool.getConnection();
        try{        
            let [row1] = await conn.query("SELECT item_index FROM item_table WHERE item_uid = ? ;", [itemId] );

            if( Array.isArray( row1 ) && row1.length > 0 )
            {
                console.log( row1[0].item_index) ;
                // TODO : item_uid != itemId를 하지 않으면 이어서 실행될 equpItem이 제대로 동작하지 않는다.
                // equipItem이후 처리가 되는게 아닐까?????
                const [row2] = await conn.query("UPDATE item_table SET equip = 0 WHERE owner = ? AND item_index = ? AND item_uid != ?;", 
                             [userId, row1[0].item_index, itemId] );

            }
            else{
                console.log("not found");
            }

        }catch( err ){
            console.error( err );
        }finally{
            await conn.release();
        }
    }

    static async equipItem( userId, itemId )
    {
        // TODO : 중복 장착 체크 추가 필요
        this.unEquipItemSameType( userId, itemId );
        // 테이블 구조를 바꿀지 INDEX를 추가 할지 선택 필요 => 인덱스 추가
        // 현재 있는 item_index 를 item_type으로 사용하자 일단;
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
            const [result] = await conn.query("UPDATE item_table SET equip = 1 WHERE item_uid = ? AND owner = ? ;", 
                        [itemId, userId] );

            if( result.changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            conn.release();
        }
        return retVal;
    }

    static async unEquipItem( userId, itemId )
    {
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
            const [result] = await conn.query("UPDATE item_table SET equip = 0 WHERE item_uid = ? AND owner = ? ;", 
                        [itemId, userId] );

            if( result.changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            conn.release();
        }
        return retVal;
    }

    static async buyItemByDia( user_id, itemType, price ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{
            const sql1 = "INSERT INTO item_table (item_index, owner) values (?,?);";
            const sql1a = [itemType, user_id]
            const sql1s = mysql.format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [price, user_id, price]
            const sql2 = "UPDATE user SET diamond = diamond - ? WHERE id = ? AND diamond >= ?;";
            const sql2s = mysql.format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

            if( result[0][0].affectedRows > 0 && result[0][1].affectedRows > 0 ) {
                console.log( "commit");
                await conn.commit();
                retVal = {success:true};
            }else{
                console.log( "rollback : ");                            
                await conn.rollback();
                if( result[0][1].affectedRows <= 0 ){
                    retVal = {success:false, msg:'not enough diamond'};
                }

            }
        } catch( err ){
            console.log( "rollback-", err );
            await conn.rollback();
        } finally{
            console.log( "finally");
            conn.release();
        }
        return retVal;
    }
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
            const sql2 = "UPDATE user SET money = if( money >= ?, money - ?, money) WHERE id = ?;";
            const sql2s = mysql.format( sql2, sql2a );

            console.log( sql2s );

            await conn.beginTransaction();

            const result = await conn.query( sql1s + sql2s );

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
            conn.release();
        }
        return retVal;
    };

    static async startSingleGame( user_id ){

        await UserStorage.updateBattleCoin( user_id );

        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
            const result = await conn.query("UPDATE user SET battle_coin = if( battle_coin >= 1,battle_coin - 1, battle_coin) WHERE id = (?);", [user_id] );

            if( result[0].changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            conn.release();
        }
        return retVal;
    };

    // overflow 체크 필요
    static async addUserMoney( user_id, money ){
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{        
        
            const result = await conn.query("UPDATE user SET money = money + ? WHERE id = ?;", [money, user_id] );

            if( result[0].changedRows > 0 ){
                retVal =  {success:true};
            };
        }catch( err ){
            console.error( err );
        }finally{
            conn.release();
        }
        return retVal;
    };
}


module.exports = UserStorage;


