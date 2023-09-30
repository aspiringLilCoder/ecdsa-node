import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    //Sign transaction
    const hash = toHex(keccak256(utf8ToBytes(sendAmount)));
    const signature = await secp.secp256k1.sign(hash, privateKey); //Get signature
    const publicKey = await secp.secp256k1.getPublicKey(privateKey); //Get public key

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        hash,
        publicKey: toHex(publicKey), //Convert public key to string
        signature: JSON.parse(
          //Convert signature to string
          JSON.stringify(signature, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        ),
      });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
