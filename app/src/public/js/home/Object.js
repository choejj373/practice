import { cmdDamage, cmdHeal, cmdDamageWide, cmdHealWide } from "./command.js";

export default class Object{
    constructor( name ){
        this.skillList = [];
        this.name = name;
        this.prevAttackTime = 0;
    }
    
    addSkill( skill ){
        this.skillList.push( skill );
    }
    getName(){
        return this.name;
    }

    getParty(){
        return this.party;
    }

    setParty( party ){
        this.party = party;
    }

    setStat( hp, damage, attackSpeed ){
        this.hp = hp ;
        this.damage = damage ;
        this.attackSpeed = attackSpeed;
    }

    getHp(){
        return this.hp;
    }

    updateFrame( nowTime, cmdQ,  enemy ){
        if( this.isDead() ){
            return;
        }

        if( this.prevAttackTime == 0 )
        {
            this.prevAttackTime = nowTime;
            // enemy.damaged( this.damage );
            cmdQ.push( [ this.prevAttackTime, new cmdDamage( this.getName(), this.damage, enemy ) ])
        }
        else
        {
            while( nowTime >= this.prevAttackTime + this.attackSpeed )
            {
                // enemy.damaged( this.damage );
                this.prevAttackTime += this.attackSpeed;
                cmdQ.push( [ this.prevAttackTime, new cmdDamage( this.getName(), this.damage, enemy ) ]);
                
            }
        }
        
        // 스킬 공격
        this.skillList.forEach((skill)=>{
            skill.updateFrame( nowTime, cmdQ, enemy, this );
        })
        // 단일 공격,전체 공격, 일부 공격
    }

    // damagedAll( damage )
    // {
    //     if( this.getParty() == undefined ){
    //         this.damaged( damage );
    //     }else{
    //         this.getParty().damagedAll( damage );
    //     }
    // }

    // healAll( hp ){
    //     if( this.getParty() == undefined ){
    //         this.heal( hp );
    //     }else{
    //         this.getParty().healAll( hp );
    //     }
    // }

    damaged( damage ){

        if( this.isDead()){
            return false;
        }

        this.hp -= damage;

        if( this.isDead())
        {
            console.log( this.getName() + " is Dead");
        }
        return true;
    }

    heal( _hp ){
        if( this.isDead() ){
            return false;
        }

        this.hp += _hp;
        return true;
    }

    isDead(){
        return ( this.hp <= 0 )?true:false;
    }
}