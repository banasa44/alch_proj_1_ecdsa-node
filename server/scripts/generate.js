const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex,utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require( "ethereum-cryptography/keccak");

// const privateKey = secp256k1.utils.randomPrivateKey();

// console.log('private key', toHex(privateKey));

// const publicKey = secp256k1.getPublicKey(privateKey);

// console.log('public key', toHex(publicKey));


const privateKey =
  "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const messageHash =
  "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
const signature = secp256k1.sign(messageHash, privateKey);
console.log("What is signature???", signature);
const publicKey = signature.recoverPublicKey(messageHash);
console.log("What is recoverPublicKey???", publicKey);
const publicKeyHex = `04${publicKey.x.toString(16)}${publicKey.y.toString(16)}`;
console.log("What is publicKeyHex???", publicKeyHex);

const isSigned2 = secp256k1.verify(signature, messageHash, publicKeyHex);
console.log("Is message signed by the private key?", isSigned2);

const isSigned3 = secp256k1.verify(
  signature,
  messageHash,
  secp256k1.getPublicKey(privateKey)
);
console.log("Is message signed by the private key?", isSigned3);

const transaction = {
  sender: secp256k1.getPublicKey(privateKey),
  amount: parseInt("22"),
  recipient:"032e17a773ff70516b31292166c1a5dc1711f8627c077c9ff3db6eb09ac37df327",
  transactionHash: undefined,
};

transaction.transactionHash = toHex(
  keccak256(utf8ToBytes(JSON.stringify(transaction)))
);

const signature2 = secp256k1.sign(transaction.transactionHash, privateKey);
transaction.signature = signature.toCompactHex();
console.log("Txs looks like:", transaction);

verified = secp256k1.verify(signature2, transaction.transactionHash, transaction.sender)
console.log("Is txs sender verified?", verified);
