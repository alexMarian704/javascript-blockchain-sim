const EC = require('elliptic').ec
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('Private '+ privateKey)
console.log('Public ' + publicKey)

//348c45c37381511d7769c5304b8a1ef3950bedbbd5b025a58c7b0b348bc02fcf

//045896da18418dce557f5a5e9a6dc3d33857e4b5971677fc5a5c4053e37e1e3bc8b858add2ac17592b41552a1147827654e3c97b71adca15ee50170702d42dedde
