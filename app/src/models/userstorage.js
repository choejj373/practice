"user strict";

class UserStorage{
    static #users ={
        id: ["choejj", "choejj373", "choejj123"],
        psword: ["111", "123", " 134"],
        name: ["", "","" ],
    };

    static getusers(...args){

        const users = this.#users;
        const newUsers = args.reduce(( newUsers, field) =>{
//            console.log( newUsers, args);
            if( users.hasOwnProperty(field)){
                newUsers[field] = users[field];
            }
            return newUsers;

        }, {});

        return newUsers;
    }
}

module.exports = UserStorage;


