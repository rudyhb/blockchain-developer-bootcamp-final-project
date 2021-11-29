# Final Project - NFT ID

## Deployed dApp
[https://nftid.app/](https://nftid.app/)

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
- `yarn install`
- `yarn start`
- open a browser with MetaMask installed to `http://localhost:3000`

## Screencast link
`//TODO`

## Public Ethereum wallet for certification
`0x55F9BF9CCde8f9bE135cb2bb973986001F4b1c27`

## Project description
The NFT ID dApp provides an alternative to the `sign in with Google/Apple` web2 solutions out there.

A user mints an NFT ID, which serves as the user's account. To authenticate, the user simply has to prove to the web2 site that they own the NFT by signing a challenge.

No more usernames and passwords! All you need to log in to a web2 site is MetaMask (more wallets coming in the future).

### Workflow to create NFT
* User goes to [https://nftid.app/](https://nftid.app/) and clicks to mint a new NFT ID.

### Simple workflow to log into a web2 site
* User enters website and clicks, "log in with web3" (you can try this out at [https://nftid.app/](https://nftid.app/))
* User connects to his MetaMask wallet.
* User chooses the NFT to use to log in. A message is sent to the server containing the NFT address/token id.
* The server issues a challenge to the user which contains NFT token id, as well as a random `requestId`.
* The user signs the challenge (try signing it with MetaMask!) sends the signature to the server.
* The server validates the signature and recovers the user's address. The server then uses an RPC node (ex: Infura) to check with the NFT ID smart contract whether the recovered address has access to the NFT token id provided.
* If the address has access, the server issues an auth token back to the user.

## Features not yet implemented
* More customization on the NFT data: for example, data about email, avatar, etc.
* More wallet options (walletconnect, etc)
* L2 options
* look into the possibility of adding privacy: maybe instead of storing the users (public keys) it might be possible to store a hash?
* generalize the logic so that a user can sign in to a web2 site by proving ownership of any NFT

## Future Security Considerations
* The server should wait until the owner of the NFT has not changed in the last ~3-10 blocks to be safe before sending the challenge.
* Signing messages with Argent is different than with an externally owned account ([https://docs.argent.xyz/wallet-connect-and-argent](https://docs.argent.xyz/wallet-connect-and-argent))
