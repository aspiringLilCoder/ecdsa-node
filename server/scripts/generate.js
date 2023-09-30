const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();

console.log("private key: ", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);

console.log("address: ", toHex(keccak256(publicKey.slice(1)).slice(-20)));
