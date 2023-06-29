const jwt = require('../modules/jwt');
// const MSG = require('../modules/reponseMessage');
// const CODE = require('../modules/statusCode');
// const util = require('../modules/util');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken : async ( req, res, next )=>{
        let token = req.cookies.token;
        if( !token ){
            // return res.json( util.fail( CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
            console.log("not found token")
            return res.redirect("/login");        
        }

        const user = await jwt.verify( token );

        if( user == TOKEN_EXPIRED ){
            // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN));
            console.log("token expired")
            return res.json( {success:false, msg:"토큰 expired"})
        }
     
        if( user == TOKEN_INVALID){
            // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
            console.log("token invalid")
            return res.json( {success:false, msg:"토큰 invalid"})
        }

        if( user.userId === undefined ){
             // return res.json( util.fail( CODE.UNAUTHORIZED, MSG.INVALID_TOKEN ));
             console.log("token payload invalid")
             return res.json( {success:false, msg:"토큰 payload invalid"})
        }
            
        req.userId = user.userId;
        
        next();
    }
}

module.exports = authUtil;