import server from "./server";

import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value; //Set value of privateKey from input
    setPrivateKey(privateKey); //Set privateKey

    const publicKey = secp.secp256k1.getPublicKey(privateKey); //Get the public key from the private key
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20)); //Get the address from the public key

    setAddress(address); //Set the address

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Input private key to sign the transaction:
        <input
          placeholder="Type in your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
