"use strict"

const QuestStorage = require('../models/queststorage');

require('moment-timezone');
const moment = require('moment');


// 1. DB에서 QUEST LIST를 모두 가져온다.
// 2. 유저 생성시 퀘스트를 미리 모두 생성해둔다.
// 3. 유저의 퀘스트 정보 요청시 DB에서 가져오고 EXPIRED 된 퀘스트들은 삭제하거나 RESET 해준다.
// 4. 퀘스트별로 UPDATE가 필요한 부분은 이 모듈을 통해서  처리한다.( 매일 로그인, 몬스터 처치, 보스 처치 등등 )
// 5. 보상 부여도 여기서

class Quest{

// 여기서 userquestinfo를 가져온다.
// 가져오다가 expired된 quest가 있다면 갱신해주자
    constructor(){
        this.questMap = new Map();
        QuestStorage.loadQuestList()
        .then((result)=>{

            result.quests.forEach( (quest) =>{
                this.questMap.set( quest.id, quest) ;
            } );
            // console.log( this.questMap );
        })
        .catch(console.log)
    }

    // questList를 기반하여 모든 퀘스트를 user_quest Table에 넣어둔다.
    // TODO : 중간에 추가된 퀘스트에 대한 처리가 필요하다.
    createUserQuestAll( userId )
    {
        console.log( "Quest.createUserQuestAll");
        QuestStorage.createUserQuestAll( userId, this.questMap );
    }

    // getQuestIndexByFulfillType( fulfillType )
    // {
    //     let result = [];
    //     this.questList.forEach((quest)=>{
    //         if( quest.fulfill_type == fulfillType ){
    //             result.push( quest.id );
    //         }
    //     });
    //     return result;
    // }

    getQuestInfo( questIndex ){
        // let result = { 
        //     rewardType : 0,
        //     rewardValue : 0,
        //     rewardSubtype : 0,
        //     fulfill_value : 0,
        //     next_quest : 0,
        //     type : 0,
        // }

        // this.questList.forEach((quest)=>{
        //     if( quest.id == questIndex ){
        //         result.rewardType = quest.reward_type;
        //         result.rewardValue = quest.reward_value;
        //         result.fulfill_value = quest.fulfill_value;
        //         result.rewardSubtype = quest.reward_subtype;
        //         result.type = quest.type;
        //         result.next_quest = quest.next_quest;
        //     }
        // });

        return this.questMap.get( questIndex );
    }

    findQuestType( questIndex ){
        return this.questMap.get( questIndex );
    }
    // TODO 보상 지급이 완료된 후 NEXT QUEST를 넣어주고 있는데 이를 보상 지급과 함께 처리할수 있도록 해보자
    // 보상 지급전 제한을 체크 하는 쿼리도 같이 넣어주면 더 좋을것 같다.;;
    // 한번에 너무 많은 테이블을 건드리는건 아닌지 모르겠네;;;SP로 처리하는게 더 낫겠다;;;;
    async rewardQuestReward( userId, questId, questIndex ){
        const quest = this.getQuestInfo( questIndex );

        let response = { success:false, msg:"Error" };

        if( quest.reward_type == 0){
            return { success:false, msg:"Not Found Reward" }
        }
        
        //완료를 위해서 스테이지 클리어 제한이 걸린 퀘스트
        if( quest.limit_type === 1)
        {
            //TODO 현재 클리어한 스테이지 정보가 필요하다.
            //어디엔가 저장후 이곳에서 비교해야 한다.
        }

        // DB에 userId, questId, questIndex, value >= fulfill_value , complete = 0 으로 체크하여
        // set complete = 1 && 보상 지급
        switch( quest.reward_type )
        {
            case 1:// 다이아몬드
                response = await QuestStorage.rewardDiamond( userId, questId, questIndex, quest.fulfill_value, quest.reward_value );
                break;
            case 2://골드
                response = await QuestStorage.rewardMoney( userId, questId, questIndex, quest.fulfill_value, quest.reward_value );
                break;
            case 3://아이템
                response = await QuestStorage.rewardItem( userId, questId, questIndex, quest.fulfill_value, quest.reward_value, quest.reward_subtype );
                break;
            default:
                console.log("Invalid reward Type : ", quest.reward_type );
                break;
        }

        const nextQuestType = this.findQuestType( quest.next_quest );

        console.log( `userId:${userId}, questId:${questId}, nextQuestIndex:${quest.next_quest}, nextQuestType:${nextQuestType}` );
        console.log( response.success );
        //보상 지급 완료 && 노말 타입 퀘스트 && next_quest가 설정 되어 있는 경우에만 연계 퀘스트를 자동으로 생성해 준다.
        if( response.success && quest.type === 0 && quest.next_quest > 0 )
        {
            //기존 퀘스트 삭제 && 다음 퀘스트 추가
            response = QuestStorage.questDeleteNCreate( userId, questId, quest.next_quest, nextQuestType );
        }
        return response;
    }

    // 스테이지 클리어시 퀘스트 값 변경
    processStageClear( userId, stageId ){
        QuestStorage.setUserQuestValue( userId, 3, stageId );
    }
    // 다이아 소모시 퀘스트 값 변경
    processUseDiamond( userId, value )
    {
        QuestStorage.addUserQuestValue( userId, 2, value );
    }
    
    //로그인시 퀘스트 값 변경
    processLogin( userId ){
        QuestStorage.addUserQuestValue( userId, 1, 1 );

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