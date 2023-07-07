export default class Party
{
    constructor(name){
        this.memberList = [];
        this.name = name;
    }

    getName(){
        return this.name;
    }

    addMember( member ){
        this.memberList.push( member );
    }

    updateFrame( nowTime, cmdQ, enemy ){
        this.memberList.forEach( (member)=>{
            member.updateFrame( nowTime, cmdQ, enemy );
        })
    }
    
    damagedAll( _damage ){
        this.memberList.forEach( (member)=>{
            member.damaged( _damage );
        })
    }
    damaged( damage ){
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( this.memberList[i].damaged(damage) ){
                return true;
            }
        }
        return false;
    }

    heal( hp )
    {
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( this.memberList[i].heal(hp) ){
                return true;
            }
        }
        return false;
    }
    isDead(){
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( !this.memberList[i].isDead() ){
                return false;
            }
        }
        return true;
    }

    getHp(){
        let hp = 0;
        for( let i = 0; i < this.memberList.length; i++ )
        {
            if( !this.memberList[i].isDead() ){
                hp += this.memberList[i].getHp();
            }
        }
        return hp;
    }

    healAll( _hp )
    {
        this.memberList.forEach((member)=>{
            member.heal( _hp );
        })        
    }
}

// module.exports = Party;