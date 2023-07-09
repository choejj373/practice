const crypto = require("crypto");
const JSEncrypt = require('node-jsencrypt');
class Secret{

    constructor(){
        this.PrivateKey    = process.env.PRIVATEKEY;
        this.PublicKey     = process.env.PUBLICKEY;
        this.SymmetricKey  = crypto.randomBytes(32);
    }

    getPrivateKey()
    {
        return this.PrivateKey;
    }
    getPublicKey()
    {
        return this.PublicKey;
    }

    getSymmetricKey()
    {
        return this.SymmetricKey;
    }

    getSymmetricKeyEncodedByPrivateKey()
    {
        const keyp = crypto.createPrivateKey({
                    key: this.PrivateKey,
                    passphrase: "",
                    padding: crypto.constants.RSA_PKCS1_PADDING
                });    
            
        const dec = crypto.privateEncrypt(keyp, Buffer.from( SymmetricKey));
        return dec.toString("base64");
    }
    getValueDecodedByPrivateKey( encodedText )
    {
        const jsEncrypt = new JSEncrypt();

        console.log( this.PrivateKey ) ;
        jsEncrypt.setPrivateKey( this.PrivateKey );

        return jsEncrypt.decrypt( encodedText );
        
        // const key = crypto.createPrivateKey({
        //     key: this.PrivateKey,
        //     passphrase: '',
        //     padding: crypto.constants.RSA_PKCS1_PADDING
        // });

        // const dec = crypto.privateDecrypt(key, Buffer.from(encodedText, "base64"));
        //const dec = crypto.privateDecrypt(key, Buffer.from(encodedText));
    
        // return dec.toString("utf8");
    }

}

module.exports = new Secret();