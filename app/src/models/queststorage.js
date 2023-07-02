"use strict"

const { dbPool, mysql } = require("../config/db");


/*
user_quest
id : AUTO INC not null unique
quest_index = quest_list.id not null
quest_type  = quest_list.type not null
owner = account.id : secondary key not null
value : DEFAULT 0   not null

expire_date : NULL
complete : 보상 까지 받아서 완료 되었는지 체크
*/

/*
quest_list
id : pk int
type    // 일일/주간/업적 not null int
reward_type default 0 
reward_Value default 0 

fulfill_type default 0  
fulfill_value default 0 
*/



class QuestStorage
{
    // 모든 Quest 기본 정보를 db에서 가져온다.
    async loadQuestList(){
        const conn = await dbPool.getConnection();

        let retVal = { success: false, quests:[] };

        try{
            const [row] = await conn.query("SELECT * FROM quest_list;" );

            retVal.success = true;
            retVal.quests = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
        return retVal;
    }

    //퀘스트 완료 조건 체크하여 Diamond 지급
    //체크 조건이 좀 많은것 같은데 줄일 방법이 있을까?
    // id로 한번에 찾기 때문에 속도 문제는 없을것 같아.
    async rewardDiamond( userId, questId, questIndex, fulfillValue, rewardValue )
    {
        const conn = await dbPool.getConnection();
        let retVal = { success:false };
        try{
            const sql1 = "UPDATE user_quest SET complete = 1 WHERE  id = ? AND complete = 0 AND owner = ? AND quest_index = ? AND value >= ?;";
            const sql1a = [ questId, userId, questIndex, fulfillValue ];
            const sql1s = mysql.format( sql1, sql1a );
            console.log( sql1s );

            const sql2a = [ rewardValue, userId ];
            const sql2 = "UPDATE account SET diamond = diamond + ? WHERE id = ?;";
            const sql2s = mysql.format( sql2, sql2a);

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
                retVal = {success:false, msg:"db query failed"};
            }
        } catch( err ){
            console.log( "rollback-", err );
            retVal = {success:false, msg:"db query error"};
            await conn.rollback();
        } finally{
            console.log( "finally");
            conn.release();
        }
        return retVal;
    }

    async addUserQuestValue( userId, questIndex, addValue ){

        const conn = await dbPool.getConnection();

        try{
            await conn.query("UPDATE user_quest SET value = value + ? WHERE owner = ? AND quest_index=?;", 
                    [addValue, userId, questIndex] );

        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
    }

    async getUserQuestInfo( userId, questType ){
        const conn = await dbPool.getConnection();

        let retVal = { success: false, quests:[] };

        try{
            const [row] = await conn.query("SELECT * FROM user_quest WHERE owner = ? AND quest_type=?;", 
                    [userId, questType] );

            retVal.success = true;
            retVal.quests = row;
        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
        return retVal;
    }
    // async getUserQuestInfo( userId ){
    //     const conn = await dbPool.getConnection();

    //     let retVal = { success: false, quests:[] };

    //     try{
    //         const [row] = await conn.query("SELECT * FROM user_quest WHERE owner = ?;", userId );;
    //         retVal.success = true;
    //         retVal.quests = row;
    //     }catch(err)
    //     {
    //         console.log(err);
    //     }finally{
    //         conn.release();
    //     }
    //     return retVal;
    // }

    // async addUserQuestValue( questId, userId, addValue )
    // {
    //     const conn = await dbPool.getConnection();        
    //     let retVal = { success: false };
        


    //     try{
    //         const [result] = await conn.query("UPDATE user_quest SET value = value + ? WHERE id = ? AND owner = ?;", 
    //                         addValue, questId, userId );

    //         if( result.affectedRows > 0){
    //             retVal.success = true;
    //         }

    //     }catch(err)
    //     {
    //         console.log(err);
    //     }finally{
    //         conn.release();
    //     }
    //     return retVal;
    // }

    // 만료된 일일/주간 퀘스트 RESET
    async resetRepeatQuestInfo( questId, userId, expireDate )
    {
        const conn = await dbPool.getConnection();

        let retVal = { success: false };

        try{
            const [result1] = await conn.query("UPDATE user_quest SET value = 0, complete = 0, expire_date = ? WHERE id = ? AND owner = ?;", 
                        [ expireDate, questId, userId ] );

            retVal.success = true;
        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
        return retVal;
    }

    async createUserQuestAll( userId, questList )
    {
        console.log( "QuestStorage.createUserQuestAll");
        console.log( userId );
        console.log( questList );

        const conn = await dbPool.getConnection();
        
        try{
            const nowDate = new Date();
            const nowDay = nowDate.getDay();

            // 주의 다음 라인부터 nowDate는 당일 자정
            const expireDailyDate = new Date( nowDate.setHours( 24,0,0,0 ) );

            let remainDayToWeekend = 0;
            if( nowDay > 0 ){
                remainDayToWeekend = 7 - nowDay;
            }
    
            const weeklyExpireDate = new Date( nowDate.setDate( nowDate.getDate() + remainDayToWeekend )  );
    

            // TODO 소스 정리좀;
            questList.forEach( (element)=>{
                switch( element.type ){
                    case 1://일일 퀘스트
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, expire_date, owner ) values ( ?, ?, ?, ? )" ,
                                [ element.id, element.type, expireDailyDate, userId ] );
                        break;
                    case 2://주간 퀘스트
                        //expireDate 금주 일요일 자정으로 변경
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, expire_date, owner ) values ( ?, ?, ?, ? )" ,
                                [ element.id, element.type, weeklyExpireDate, userId ] );

                        break;
                    default:// 업적
                        conn.query("INSERT INTO user_quest ( quest_index, quest_type, owner ) values ( ?, ?, ? )" ,
                                [ element.id, element.type, userId ] );

                        break;
                }
            });
            
        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
    }
}

module.exports = new QuestStorage();
