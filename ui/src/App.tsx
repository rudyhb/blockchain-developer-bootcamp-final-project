import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useWeb3Info from "./hooks/useWeb3Info";
import Web3Provider from "./components/shared/Web3Provider";
import Web3Button from "./components/web3/Web3Button";

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
          <code>details: {JSON.stringify(useWeb3Info())}</code>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </Web3Provider>
  );
}

export default App;
