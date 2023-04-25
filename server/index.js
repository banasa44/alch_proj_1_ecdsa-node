const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
// const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0309a1ca9eaf6292c93ef2e47262ee4b98bc6bcce35d80995c5bf735bd47916430": 100, // <-pk - sk -> c02f1b8c387262b10272c313f7a4a5155e225c648d336e0f64f3e3139fc5abc4
  "02b7568afc54b6e6b0506c2e1c201635c2d9c9a6b1646028bda2052ae600060943": 80, // <-pk - sk -> 2e6c7cc24567c441f7d5bc3b03f32b6d5cbc2bd92cf0cfccc263e0a28af50bdd
  "02ed85424aac5ac2cfe94968cd3546705299a73861f8f6c796ce6caa78bed5e416": 90, // <-pk - sk -> cbd37e3c04ee5e9a6ca585943d363e810cfa6721c5903716eb18c550fdc191d7
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, transactionHash, signature } = req.body;

  if (! secp256k1.verify(signature, transactionHash, sender)) {
    res.status(409).send({ message: "Sender is not the signer" });
    return;
  }


  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    return;
  } 
  
  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
