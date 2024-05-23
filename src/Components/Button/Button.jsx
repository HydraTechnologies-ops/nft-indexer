import React, { useState, useEffect } from "react";
import "./Button.css";

import detectEthereumProvider from "@metamask/detect-provider";

export function MetaMaskButton({ updateUser }) {
  const [hasProvider, setHasProvider] = useState(false);
  const initialState = { accounts: [] };
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      //TODO: CHECK THIS

      console.log(provider);
      // Transform provider to true or false.
      setHasProvider(Boolean(provider));
    };

    getProvider();
  }, []);

  const updateWallet = async (accounts) => {
    updateUser({ accounts });
  };

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  return (
    <div className="MetaMaskButton">
      {hasProvider && <button onClick={handleConnect}>Connect MetaMask</button>}
      {wallet.accounts.length > 0 && (
        <div>Wallet Accounts: {wallet.accounts[0]}</div>
      )}
    </div>
  );
}
