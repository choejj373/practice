"use strict"

const QuestStorage = require('../models/queststorage');

require('moment-timezone');
const moment = require('moment');


// 1. DB에서 QUEST LIST를 모두 가져온다.
// 2. 유저 생성시 퀘스트를 미리 모두 생성해둔다.
// 3. 유저의 퀘스트 정보 요청시 DB에서 가져오고 EXPIRED 된 퀘스트들은 삭제하거나 RESET 해준다.
// 4. 퀘스트별로 UPDATE가 필요한 부분은 이 모듈을 통해서  처리한다.( 매일 로그인, 몬스터 처치, 보스 처치 등등 )
// 5. 보상 부여도 여기서

// enum
// fulfill type : 1 - 로그인, 2 - 다이아 사용
// reward type : 1 - 다이아몬드, 2 - 골드, 3 - 아이템
class Quest{

// 여기서 userquestinfo를 가져온다.
// 가져오다가 expired된 quest가 있다면 갱신해주자
    constructor(){
        QuestStorage.loadQuestList()
        .then((result)=>{
            this.questList = result.quests;
            console.log( this.questList );
        })
        .catch(console.log)
    }

    // questList를 기반하여 모든 퀘스트를 user_quest Table에 넣어둔다.
    // TODO : 중간에 추가된 퀘스트에 대한 처리가 필요하다.
    createUserQuestAll( userId )
    {
        console.log( "Quest.createUserQuestAll");
        QuestStorage.createUserQuestAll( userId, this.questList );
    }

    getQuestIndexByFulfill( fulfillType )
    {
        let result = [];
        this.questList.forEach((quest)=>{
            if( quest.fulfill_type == fulfillType ){
                result.push( quest.id );
            }
        });
        return result;
    }

    getRewardInfo( questIndex ){
        let result = { 
            rewardType : 0,
            rewardValue : 0,
            rewardSubtype : 0,
            fulfill_value : 0
        }

        this.questList.forEach((quest)=>{
            if( quest.id == questIndex ){
                result.rewardType = quest.reward_type;
                result.rewardValue = quest.reward_value;
                result.fulfill_value = quest.fulfill_value;
                result.rewardSubtype = quest.reward_subtype;
            }
        });

        return result;
    }

    async rewardQuestReward( userId, questId, questIndex ){
        const result = this.getRewardInfo( questIndex );
        let response = { success:false, msg:"Error" };

        if( result.rewardType == 0){
            return { success:false, msg:"Not Found Reward" }
        }

        // DB에 userId, questId, questIndex, value >= fulfill_value , complete = 0 으로 체크하여
        // set complete = 1 && 보상 지급
        switch( result.rewardType )
        {
            case 1:// 다이아몬드
                response = QuestStorage.rewardDiamond( userId, questId, questIndex, result.fulfill_value, result.rewardValue );
                break;
            case 2://골드
                response = QuestStorage.rewardMoney( userId, questId, questIndex, result.fulfill_value, result.rewardValue );
                break;
            case 3://아이템
                console.log("TODO" );
                response = QuestStorage.rewardItem( userId, questId, questIndex, result.fulfill_value, result.rewardValue, result.rewardSubtype );
                break;
            default:
                console.log("Invalid reward Type : ", result.rewardType );
                break;
        }
        return response;
    }

    // 다이아 소모시 퀘스트 값 변경
    processUseDiamond( userId, value )
    {
        const questIndexList = this.getQuestIndexByFulfill( 2 );
        // console.log( questIndexList );
        questIndexList.forEach( (questIndex)=>{
            // console.log( questIndex );
            QuestStorage.addUserQuestValue( userId, questIndex, value );
        });
    }
    
    //로그인시 퀘스트 값 변경
    processLogin( userId ){

        const questIndexList = this.getQuestIndexByFulfill( 1 );
        // console.log( questIndexList );
        questIndexList.forEach( (questIndex)=>{
            // console.log( questIndex );
            QuestStorage.addUserQuestValue( userId, questIndex, 1 );
        });
    }
    

    async getUserNormalQuestInfo( userId ){
        console.log("Quest.getUserNormalQuestInfo : ", userId );
        return await QuestStorage.getUserQuestInfo( userId, 0 );
    }
    // 유저의 정보를 DB로 부터 가져오고 만료된 퀘스트에 대하여 처리(RESET OR DELETE) 해준다.
    async getUserWeeklyQuestInfo( userId ){
        console.log("Quest.getUserWeeklyQuestInfo : ", userId );

        let result = await QuestStorage.getUserQuestInfo( userId, 2 );

        if( !result.success ){
            return result;
        }

        const nowDate = new Date();
        const nowTime = nowDate.getTime();        
        const nowDay = nowDate.getDay();

        nowDate.setHours( 24,0,0,0);

        // sunday:0 , monday:1 ....
        let remainDayToWeekend = 0;
        if( nowDay > 0 ){
            remainDayToWeekend = 7 - nowDay;
        }

        const newWeeklyExpireDate = new Date( nowDate.setDate( nowDate.getDate() + remainDayToWeekend )  );

        result.quests.forEach( (element)=>{
            let expireTime = new Date( element.expire_date ).getTime();

            if( expireTime < nowTime ){
                
                element.value = 0;
                element.expire_date = moment(newWeeklyExpireDate).tz('Asia/Seoul').format();;
                element.complete = 0;

                QuestStorage.resetRepeatQuestInfo( element.id, userId, newWeeklyExpireDate )
            }
        });
        return result;
    }    

    // 유저의 정보를 DB로 부터 가져오고 만료된 퀘스트에 대하여 처리(RESET OR DELETE) 해준다.
    async getUserDailyQuestInfo( userId ){
        console.log("Quest.getUserDailyQuestInfo : ", userId );

        let result = await QuestStorage.getUserQuestInfo( userId, 1 );

        if( !result.success ){
            return result;
        }
        
        const nowDate = new Date();
        const nowTime = nowDate.getTime();

        const newDailyExpireDate = new Date( nowDate.setHours( 24,0,0,0) );

        result.quests.forEach( (element)=>{
            let expireTime = new Date( element.expire_date ).getTime();

            if( expireTime < nowTime ){
                
                element.value = 0;
                element.expire_date = moment(newDailyExpireDate).tz('Asia/Seoul').format();
                element.complete = 0;

                QuestStorage.resetRepeatQuestInfo( element.id, userId, newDailyExpireDate )
            }
        });

        return result;        
    }

    // async getUserQuestInfo( userId )
    // {
    //     console.log("Quest.getUserQuestInfo : ", userId );

    //     let result = await QuestStorage.getUserQuestInfo( userId );
        
    //     const nowDate = new Date();
    //     const nowTime = nowDate.getTime();
    //     const nowDay = nowDate.getDay();

    //     const newDailyExpireDate = new Date( nowDate.setHours( 24,0,0,0) );

    //     // sunday:0 , monday:1 ....
    //     let remainDayToWeekend = 0;
    //     if( nowDay > 0 ){
    //         remainDayToWeekend = 7 - nowDay;
    //     }

    //     const newWeeklyExpireDate = new Date( nowDate.setDate( nowDate.getDate() + remainDayToWeekend )  );

    //     if( result.success) {
    //         result.quests.forEach( (element)=>{
    //             let expireTime = new Date( element.expire_date ).getTime();

    //             switch( element.quest_type ){
    //             case 1:
    //                 if( expireTime < nowTime ){
                        
    //                     element.value = 0;
    //                     element.expire_date = moment(newDailyExpireDate).tz('Asia/Seoul').format();
    //                     element.reward_receipt = 0;

    //                     QuestStorage.resetRepeatQuestInfo( element.id, userId, newDailyExpireDate )
    //                 }
    //                 break;
    //             case 2:   
    //                 if( expireTime < nowTime ){
                        
    //                     element.value = 0;
    //                     element.expire_date = moment(newWeeklyExpireDate).tz('Asia/Seoul').format();;
    //                     element.reward_receipt = 0;

    //                     QuestStorage.resetRepeatQuestInfo( element.id, userId, newWeeklyExpireDate )
    //                 }
    //                 break;
    //             default:
    //                 break;                 
    //             }
    //         });
    //     }
    //     return result;
    // }
};

module.exports = new Quest();