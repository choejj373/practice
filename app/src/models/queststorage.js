"use strict"

const { dbPool, mysql } = require("../config/db");


/*
user_quest
id : AUTO INC not null unique
quest_index = quest_list.id not null
quest_type  = quest_list.type not null
owner = account.id : secondary key not null
value : DEFAULT 0   not null

expired_date : NULL

reward_receipt : DEFAULT 0 not null - 보상을 수령했는가?
--> complete : todo 변경
*/

/*
quest_list
id : pk int
type    // 일일/주간/업적 not null int
reward_type default 0 
reward_Value default 0 

fulfill_type default 0  //달성 타입 : todo 추가
fulfill_value default 0 //달성 값   : todo 추가
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

    async addUserQuestValue( questId, userId, addValue )
    {
        const conn = await dbPool.getConnection();        
        let retVal = { success: false };
        


        try{
            const [result] = await conn.query("UPDATE user_quest SET value = value + ? WHERE id = ? AND owner = ?;", 
                            addValue, questId, userId );

            if( result.affectedRows > 0){
                retVal.success = true;
            }

        }catch(err)
        {
            console.log(err);
        }finally{
            conn.release();
        }
        return retVal;
    }

    // 만료된 일일/주간 퀘스트 RESET
    async resetRepeatQuestInfo( questId, userId, expireDate )
    {
        const conn = await dbPool.getConnection();

        let retVal = { success: false };

        try{
            const [result1] = await conn.query("UPDATE user_quest SET value = 0, reward_receipt = 0, expire_date = ? WHERE id = ? AND owner = ?;", 
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
