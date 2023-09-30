const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

//Sample adderesses
const balances = {
  ce57685a9339408f9a7d7be79085d371645ba723: 100, //Private key: 3dbda62a6bc2bf8b7d1bdf26cb794eb9109259e3e545ae59e2b8c5204fedcfdd
  "2ab383161a2268a13b4a51ada2d322797f834eb0": 50, //Private key: 88ff760e5fc5e833d81b2c788c5719424863c7d3c0aeb58a6e9a3c35a9f10c5d
  "4c860418387fc523bda031dddd79c31c09b7b2c4": 75, //Private key: a3e6f3fa19670b7859efdccb6cca73025f560b5ced26bdaa8889b4d818119733
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, hash, publicKey } = req.body; //Get signature, hash, and publicKey

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const sign = {
    //Convert signature to RecoveredSignature
    ...signature,
    r: BigInt(signature.r),
    s: BigInt(signature.s),
  };

  if (!secp.secp256k1.verify(sign, hash, hexToBytes(publicKey))) {
    //Verify if the signature was made by the owner of the public key
    res.status(400).send({ message: "You are not the owner!" }); //Send error if the signature cannot be verified
  } else if (balances[sender] < amount) {
    console.log("not enough");
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
