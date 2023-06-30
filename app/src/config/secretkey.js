// 유출되면 안되는 화일이니 product 일 경우 .gitignore필요
module.exports = {
    secretKey : "YoUrSeCrEtKeY",
    options : {
        algorithm : "HS256",
        expiresIn : "1h",
        issuer : "choejj"
    }
}