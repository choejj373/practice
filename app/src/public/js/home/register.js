"use strict"

const id = document.querySelector("#id");
const name = document.querySelector("#name");
const psword = document.querySelector("#psword");
const pswordConfirm = document.querySelector("#psword-confirm");
const registerBtn = document.querySelector("#button");

// console.log("hello register");

registerBtn.addEventListener("click", register );

function register() {

    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        pswordConfirm: pswordConfirm.value,
    };

   console.log( req.id + req.name + req.psword );

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then( (res) => res.json()) // json() promise
    .then( (res) => {
        //console.log( res);
        if( res.success ){
            location.href = "/login";
        } else {
          alert( res.msg ); //=> cathc 발생
          //  location.href = "/login"
        }
    })
};