const Cryptr = require('cryptr');
const cryptr = new Cryptr('Secret');


exports.encrypt=(text)=>{
    return cryptr.encrypt(text);
}

exports.decrypt=(hash)=>{
    return cryptr.decrypt(hash);
} 