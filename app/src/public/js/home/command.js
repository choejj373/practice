class command{
    constructor(){}
    exec(){}
}

export class cmdDamage extends command{
    constructor( attacker, damage, target )
    {
        super();
        this.attacker = attacker;
        this.damage = damage;
        this.target = target;//party
    }
    exec(){
        this.target.damaged( this.damage );
        return ( this.attacker + " is attack to " + this.target.getName() );
    }
}

export class cmdHeal extends command{
    constructor( healer, hp, target )
    {
        super();
        this.healer = healer;
        this.hp = hp;
        this.target = target;//object
    }
    exec(){
        this.target.heal( this.hp );
        return ( this.healer + " is heal to " + this.target.getName() );
    }
}

export class cmdDamageWide extends command{
    constructor( attacker, damage, target )
    {
        super();
        this.attacker = attacker;
        this.damage = damage;
        this.target = target;// Party
    }
    exec(){

        this.target.damagedAll( this.damage );
        return ( this.attacker + " is AttackWide to " + this.target.getName() );
    }
}

export class cmdHealWide extends command{
    constructor( healer, hp, target )
    {
        super();
        this.healer = healer;
        this.hp = hp;
        this.target = target; // Party
    }
    exec(){
        this.target.healAll( this.hp );
        return ( this.healer + " is HealWide to " + this.target.getName() );
    }
}