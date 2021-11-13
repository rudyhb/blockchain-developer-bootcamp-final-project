import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3Provider from "./components/shared/Web3Provider";
import Web3Button from "./components/web3/Web3Button";
import TokenManagement from "./components/TokenManagement";

function App() {
  return (
    <Web3Provider
      render={({ setWeb3Options, metamaskConfig }) => (
        <>
          <Web3Button
            setWeb3Options={setWeb3Options}
            metamaskConfig={metamaskConfig}
          />
        </>
      )}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <TokenManagement />
        </header>
      </div>
    </Web3Provider>
  );
}

export default App;
