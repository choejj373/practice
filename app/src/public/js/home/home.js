
const mainView = document.getElementById("mainView");

const logoutBtn = document.getElementById("logout");
const storeBtn = document.getElementById("store");
const invenBtn = document.getElementById("inven");
const combatBtn = document.getElementById("combat");
const challengeBtn = document.getElementById("challenge");
const evolutionBtn = document.getElementById("evolution");
const freeGetBtn = document.getElementById("freeGetBtn");

const buyWeaponBtn = document.getElementById("buyWeapon");
const buyNecklaceBtn = document.getElementById("buyNecklace");
const buyGloveBtn = document.getElementById("buyGlove");
const buyArmorBtn = document.getElementById("buyArmor");
const buyBeltBtn = document.getElementById("buyBelt");
const buyShoesBtn = document.getElementById("buyShoes");

const invenList = document.getElementById('inventory');
const sellItemBtn = document.getElementById('sellItemBtn');

const questBtn = document.getElementById('quest');
const questView = document.getElementById('questView');
const combatView = document.getElementById('combatView');

// const dailyQuestView = document.getElementById('dailyQuestView');
// const weeklyQuestView = document.getElementById('weeklyQuestView');
// const normalQuestView = document.getElementById('normalQuestView');

// const dailyQuestList = document.getElementById('dailyQuestList');
// const weeklyQuestList = document.getElementById('weeklyQuestList');
// const normalQuestList = document.getElementById('normalQuestList');

const questList = document.getElementById('questList');

const dailyQuestBtn = document.getElementById('dailyQuestBtn');
const weeklyQuestBtn = document.getElementById('weeklyQuestBtn');
const normalQuestBtn = document.getElementById('normalQuestBtn');


questBtn.addEventListener("click", showQuestView );

dailyQuestBtn.addEventListener("click", showDailyQuestList );
weeklyQuestBtn.addEventListener("click", showWeeklyQuestList );
normalQuestBtn.addEventListener("click", showNormalQuestList );



sellItemBtn.addEventListener("click", promptInputItemId );
buyWeaponBtn.addEventListener("click", ()=>buyItem(1) );
buyNecklaceBtn.addEventListener("click", ()=>buyItem(2) );
buyGloveBtn.addEventListener("click", ()=>buyItem(3) );
buyArmorBtn.addEventListener("click", ()=>buyItem(4) );
buyBeltBtn.addEventListener("click", ()=>buyItem(5) );
buyShoesBtn.addEventListener("click", ()=>buyItem(6) );

logoutBtn.addEventListener("click", logout );
storeBtn.addEventListener("click", showStore );
invenBtn.addEventListener("click", showInven );
combatBtn.addEventListener("click", showCombat );

evolutionBtn.addEventListener("click", clearMainView );
challengeBtn.addEventListener("click", clearMainView );

freeGetBtn.addEventListener("click", getFreeDiamond );

function showQuestView(){
    console.log('showQuestView');
    clearCombatRightView();
    questView.style.display = '';

    showDailyQuestList();
}

function showDailyQuestList(){
    console.log('showDailyQuestList');

    fetch("/quest/daily")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id} TYPE:${element.quest_type} EXPIRED:${element.expire_date}`;
                
                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
        }
    })    
}
function showWeeklyQuestList(){
    console.log('showWeeklyQuestList');

    fetch("/quest/weekly")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id} TYPE:${element.quest_type} EXPIRED:${element.expire_date}`;
                
                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
        }
    })    
    
}
function showNormalQuestList(){
    console.log('showNormalQuestList');
    fetch("/quest/normal")
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            //오른쪽 화면에 표시하자.
            questList.replaceChildren();

            res.quests.forEach((element)=>{
                let item = document.createElement('li');
                item.textContent = `ID:${element.id} TYPE:${element.quest_type} EXPIRED:${element.expire_date}`;
                
                questList.appendChild( item);
            })

        } else {
            alert( res.msg );
        }
    })        
    
}

// function getQuestList(){
//     fetch("/quest")
//     .then((res) => res.json()) // json() promise
//     .then((res) => {
//         console.log( res );
//         if( res.success ){
//             //오른쪽 화면에 표시하자.
//             dailyQuestList.replaceChildren();
//             weeklyQuestList.replaceChildren();
//             normalQuestList.replaceChildren();

//             res.quests.forEach((element)=>{
//                 let item = document.createElement('li');
//                 item.textContent = `ID:${element.id} TYPE:${element.quest_type} EXPIRED:${element.expire_date}`;
                
//                 switch( element.quest_type ){
//                     case 1:
//                         dailyQuestList.appendChild( item);
//                         break;
//                     case 2:
//                         weeklyQuestList.appendChild( item);
//                         break;
//                     default:
//                         normalQuestList.appendChild( item);
//                         break;
//                 }
//             })

//             clearCombatRightView();
//             questView.style.display = '';

//         } else {
//             alert( res.msg );
//         }
//     })
// }

function promptInputItemId(){
    console.log( "promptInputItemId");
    const itemId = prompt("아이템 아이디를 입력해주세요");
    console.log( itemId );

    fetch("/equipment/inventory/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( itemId ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            showInven();
        } else {
            alert( res.msg );
        }
    })
}

function onClickedEquip( element ){
    console.log( "clicked : ", parseInt( element.target.innerText ));
    fetch("/equipment/equip", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( element.target.innerText ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            showInven();
        } else {
            alert( res.msg );
        }
    })
}

function onClickedInven( element ){
    console.log( "clicked : ", parseInt( element.target.innerText ));
    fetch("/equipment/inventory", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            itemUid : parseInt( element.target.innerText ),       
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            showInven();
        } else {
            alert( res.msg );
        }
    })
}

function buyItem( type )
{
    console.log( "buyItem : ", type )

    fetch("/store/diamond", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            type : 1,        //무료 다이아
            itemType : type
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){

        } else {
            alert( res.msg );
        }
    })

}


function getFreeDiamond(){

    fetch("/store/daily", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            type : 1,        //무료 다이아
        } )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            freeGetBtn.disabled = true;
        } else {
            alert( res.msg );
        }
    })
}

function clearMainView()
{
    const mainDiv = document.getElementById("mainView");
    // TODO 모든 child list를 구해서 display = none으로;

    const mainStore = document.getElementById("mainStore");
    mainStore.style.display = 'none' ;

    const mainInven = document.getElementById("mainInven");
    mainInven.style.display = 'none' ;

    const mainCombat = document.getElementById("mainCombat");
    mainCombat.style.display = 'none' ;
}

function clearCombatRightView(){
    console.log("clearCombatRightView")
    combatView.style.display = 'none';
    questView.style.display = 'none';
}

function showCombat(){
    clearMainView();   
    const element = document.getElementById("mainCombat");
    element.style.display = '' ;

    clearCombatRightView();
    combatView.style.display = '';
 }

function showInven()
{
    clearMainView();   
 
    fetch("/equipment" )// GetUserStoreInfo
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            const inven = document.querySelector('#inventory');
            const equip = document.querySelector('#equip');

            inven.replaceChildren();
            equip.replaceChildren();

            res.items.forEach(element => {

                if( element.equip )
                {
                    let messageItem = document.createElement('li');
                    messageItem.textContent = `${element.item_uid}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedEquip(messageItem)} );

                    equip.appendChild(messageItem);

                }
                else{
                    let messageItem = document.createElement('li');
                    messageItem.textContent = `${element.item_uid}`;

                    messageItem.addEventListener("click", function(messageItem){
                        onClickedInven(messageItem)} );

                    inven.appendChild(messageItem);
                }
            });
        } else {
            alert( res.msg );
        }
    })
 
    const element = document.getElementById("mainInven");
    element.style.display = '' ;
}

function showStore(){
    clearMainView();
    // 일일 무료 아이템
    // 골드로 사는 아이템
    // 다이아로 사는 아이템

    fetch("/store" )// GetUserStoreInfo
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            freeGetBtn.disabled = false;

            res.tradeList.forEach((trade)=>{
                if( trade.type == 1 ){
                    freeGetBtn.disabled = true;
                }
            });
        } else {
            alert( res.msg );
        }
    })

    const element = document.getElementById("mainStore");
    element.style.display = '' ;

    // 무료 다이아를 얻지 않았다면 무료 구매 활성화 아니라면 비활성화
}

function logout(){
    console.log( "clicked" );
    fetch("/home", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {} )
    })
    .then((res) => res.json()) // json() promise
    .then((res) => {
        console.log( res );
        if( res.success ){
            location.href = "/login";
        } else {
            alert( res.msg );
        }
    })
}

const usernameTxt = document.getElementById("name");
const expTxt = document.getElementById("exp");
const battlecoinTxt = document.getElementById("battlecoin");
const diamondTxt = document.getElementById("diamond");
const moneyTxt = document.getElementById("money");

window.onload = function(){
    console.log( "window onload" );
    
    fetch("/home" )// get
     .then((res) => res.json()) // json() promise
     .then((res) => {
         console.log( res );
         if( res.success ){

             usernameTxt.value = res.userName;
             expTxt.value = res.exp;
             battlecoinTxt.value = res.battleCoin;
             diamondTxt.value = res.diamond;
             moneyTxt.value = res.userMoney;

         } else {
             alert( res.msg );
         }
     })
};