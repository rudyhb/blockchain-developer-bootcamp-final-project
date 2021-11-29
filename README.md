# Final Project - NFT ID

## Deployed dApp
`//TODO`

## Running unit tests
### Requirements
- [Node.js](https://nodejs.org/) >= v10.13.0 and npm >= 6.4.1
- [Truffle](https://www.npmjs.com/package/truffle) and Ganache
- Yarn (`npm i -g yarn`)

### Run tests
- `ganache-cli` (run on a separate command window, and make sure it is listening on port `8545`)
- `truffle test --network development`

## Running frontend locally
### Requirements
- [Node.js](https://nodejs.org/) >= v10.13.0 and npm >= 6.4.1
- Yarn (`npm i -g yarn`)

### Run frontend
- `cd ui`
- `yarn`
- `yarn start`
- open a browser with MetaMask installed to `http://localhost:3000`

## Screencast link
`//TODO`

## Public Ethereum wallet for certification
`0x55F9BF9CCde8f9bE135cb2bb973986001F4b1c27`

## Project description
`//TODO`
### Simple workflow
* User enters website and clicks, "log in with web3".
* User chooses the wallet to use (metamask, walletconnect, etc)
* User chooses the NFT to use to log in. A message is sent to the server containing the NFT address/token id.
* The server obtains the NFT's owner address and creates a challenge message for the user to sign. The server then checks if the user's signature is valid (i.e. the user is the owner of the NFT)
* If the signature is valid, the server generates a token

## Features not yet implemented
* More customization on the NFT data: for example, data about email, avatar, etc.
* More wallet options (walletconnect, etc)
* L2 options
* look into the possibility of adding privacy: maybe instead of storing the users (public keys) it might be possible to store a hash?
* generalize the logic so that a user can sign in to a web2 site by proving ownership of any NFT

## Future Security Considerations
* The server should wait until the owner of the NFT has not changed in the last ~3-10 blocks to be safe before sending the challenge.
* Signing messages with Argent is different than with an externally owned account ([https://docs.argent.xyz/wallet-connect-and-argent](https://docs.argent.xyz/wallet-connect-and-argent))
