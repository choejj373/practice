
const mainView = document.getElementById("mainView");

const logoutBtn = document.getElementById("logout");
const storeBtn = document.getElementById("store");
const invenBtn = document.getElementById("inven");
const combatBtn = document.getElementById("combat");
const challengeBtn = document.getElementById("challenge");
const evolutionBtn = document.getElementById("evolution");
const freeGetBtn = document.getElementById("freeGetBtn");

logoutBtn.addEventListener("click", logout );
storeBtn.addEventListener("click", showStore );
invenBtn.addEventListener("click", showInven );
combatBtn.addEventListener("click", showCombat );

evolutionBtn.addEventListener("click", clearMainView );
challengeBtn.addEventListener("click", clearMainView );

freeGetBtn.addEventListener("click", getFreeDiamond );

function getFreeDiamond(){

    fetch("/store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {
            storeType: 1,    //일일 상점
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

function showCombat(){
    clearMainView();   
    const element = document.getElementById("mainCombat");
    element.style.display = '' ;
}

function showInven()
{
    clearMainView();   
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
            if( res.type == 1){
                freeGetBtn.disabled = true;
            }else{
                freeGetBtn.disabled = false;
            }
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